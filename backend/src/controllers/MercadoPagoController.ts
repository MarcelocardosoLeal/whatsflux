import { Request, Response } from "express";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import AppError from "../errors/AppError";
import Company from "../models/Company";
import Invoices from "../models/Invoices";
import Setting from "../models/Setting";
import { getIO } from "../libs/socket";

export const createPreference = async (req: Request, res: Response): Promise<Response> => {
    const { price, invoiceId, companyId } = req.body;

    // 1. Obter Credenciais (Primeiro do Banco, depois do .env)
    let accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    // Tenta buscar do banco (Company ID 1 ou a empresa atual se for self-hosted?)
    // Assumindo SaaS -> Pagamento vai para o dono do SaaS (SuperAdmin).
    // Se houver uma flag "SuperAdmin" ou Company ID 1.
    // Vou buscar da CompanyId 1 por padrão para SaaS.
    const setting = await Setting.findOne({
        where: { key: "mercado_pago_access_token", companyId: 1 } // Hardcoded Company 1 as SaaS Owner
    });

    if (setting && setting.value) {
        accessToken = setting.value;
    }

    if (!accessToken) {
        throw new AppError("Mercado Pago Access Token not configured.", 500);
    }

    const client = new MercadoPagoConfig({ accessToken: accessToken });
    const preference = new Preference(client);

    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: invoiceId.toString(),
                        title: `Assinatura Whaticket - Fatura #${invoiceId}`,
                        quantity: 1,
                        unit_price: parseFloat(price)
                    }
                ],
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/financeiro`,
                    failure: `${process.env.FRONTEND_URL}/financeiro`,
                    pending: `${process.env.FRONTEND_URL}/financeiro`
                },
                auto_return: "approved",
                external_reference: invoiceId.toString(),
                notification_url: `${process.env.BACKEND_URL}/subscription/webhook/mercadopago` // Endpoint do webhook
            }
        });

        return res.json(result);
    } catch (error) {
        console.error(error);
        throw new AppError("Error creating Mercado Pago preference.", 500);
    }
};

export const webhook = async (req: Request, res: Response): Promise<Response> => {
    const { action, data } = req.body;

    if (action === "payment.created" || action === "payment.updated") {
        const paymentId = data.id;

        // Obter credenciais novamente
        let accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        const setting = await Setting.findOne({
            where: { key: "mercado_pago_access_token", companyId: 1 }
        });
        if (setting && setting.value) {
            accessToken = setting.value;
        }

        if (!accessToken) {
            console.error("Mercado Pago Access Token not found for webhook.");
            return res.status(200).send("OK");
        }

        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const payment = new Payment(client);

        try {
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === "approved") {
                const invoiceId = paymentData.external_reference;
                const invoice = await Invoices.findByPk(invoiceId);

                if (invoice) {
                    await invoice.update({
                        status: "paid"
                    });

                    const company = await Company.findByPk(invoice.companyId);
                    if (company) {
                        const expiresAt = new Date(company.dueDate);
                        expiresAt.setDate(expiresAt.getDate() + 30);
                        await company.update({
                            dueDate: expiresAt.toISOString().split("T")[0]
                        });

                        // Notificar Frontend
                        const io = getIO();
                        io.to(`company-${company.id}-mainchannel`).emit(`company-${company.id}-payment`, {
                            action: "PAID",
                            company
                        });
                    }
                }
            }

        } catch (error) {
            console.error(error);
        }
    }

    return res.status(200).send("OK");
};
