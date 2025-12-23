import { Response } from "express";

export const SendRefreshToken = (res: Response, token: string): void => {
  const frontend = process.env.FRONTEND_URL || "";
  const host = frontend.replace(/^https?:\/\//, "").split("/")[0] || "";
  const domain = host.includes(".") ? host.substring(host.indexOf(".")) : undefined;

  res.cookie("jrt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain,
    path: "/"
  });
};
