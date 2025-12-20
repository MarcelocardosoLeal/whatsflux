import Whatsapp from "../../models/Whatsapp";
import { IWhatsAppProvider, Session } from "./IWhatsAppProvider";

export class WhatsMeowProvider implements IWhatsAppProvider {
  async connect(_whatsapp: Whatsapp): Promise<Session> {
    throw new Error("WhatsMeow provider não implementado");
  }
}

