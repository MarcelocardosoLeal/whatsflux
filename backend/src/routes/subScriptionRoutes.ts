import express from "express";
import isAuth from "../middleware/isAuth";

import * as SubscriptionController from "../controllers/SubscriptionController";

const subscriptionRoutes = express.Router();
subscriptionRoutes.post("/subscription", isAuth, SubscriptionController.createSubscription);
subscriptionRoutes.post("/subscription/create/webhook", SubscriptionController.createWebhook);
subscriptionRoutes.post("/subscription/webhook/:type?", SubscriptionController.webhook);

// Rotas Mercado Pago
import * as MercadoPagoController from "../controllers/MercadoPagoController";
subscriptionRoutes.post("/subscription/mercadopago/create", isAuth, MercadoPagoController.createPreference);
subscriptionRoutes.post("/subscription/webhook/mercadopago", MercadoPagoController.webhook);

export default subscriptionRoutes;
