import Whatsapp from "../../models/Whatsapp";
import { initWASocket } from "../wbot";
import { IWhatsAppProvider, Session } from "./IWhatsAppProvider";

export class BaileysProvider implements IWhatsAppProvider {
  async connect(whatsapp: Whatsapp): Promise<Session> {
    const wbot = await initWASocket(whatsapp);
    return wbot as Session;
  }
}

