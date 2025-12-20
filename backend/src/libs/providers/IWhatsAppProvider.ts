import Whatsapp from "../../models/Whatsapp";
import { WASocket } from "@whiskeysockets/baileys";

export type Session = WASocket & { id?: number };

export interface IWhatsAppProvider {
  connect(whatsapp: Whatsapp): Promise<Session>;
}

