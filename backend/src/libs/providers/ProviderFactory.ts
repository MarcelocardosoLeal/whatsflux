import Whatsapp from "../../models/Whatsapp";
import { IWhatsAppProvider } from "./IWhatsAppProvider";
import { BaileysProvider } from "./BaileysProvider";
import { WhatsMeowProvider } from "./WhatsMeowProvider";

export function getProvider(whatsapp: Whatsapp): IWhatsAppProvider {
  const name = (whatsapp.provider || "baileys").toLowerCase();
  switch (name) {
    case "baileys":
    case "stable":
      return new BaileysProvider();
    case "whatsmeow":
      return new WhatsMeowProvider();
    default:
      return new BaileysProvider();
  }
}

