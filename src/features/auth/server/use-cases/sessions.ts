import { headers } from "next/headers";
import crypto from "crypto";
import { getIpAdress } from "./location";
import { db } from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constants";


type CreateSessionData = {
    token: string,
    userId: number,
    userAgent: string,
    ip: string
}


const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

const createUserSession = async({token, userId, userAgent, ip}: CreateSessionData)=>{
    const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

    const [session] = await db.insert(sessions).values({
        id: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
        ip,
        userAgent
    })

    return session;
}

export const createSessionAndSetCookies = async (userId: number) => {
  const token = generateSessionToken();
  const ip = await getIpAdress();
  const headerList = await headers();

  await createUserSession({
    token,
    userId: userId,
    userAgent: headerList.get("user-agent") || "",
    ip: ip
  })
};
