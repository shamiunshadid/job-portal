import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIpAdress } from "./location";
import { db } from "@/config/db";
import { sessions, users } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constants";
import { eq } from "drizzle-orm";


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


  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
  })

};


export const validateSessionAndGetUser = async(session: string)=>{
  const hashedToken = crypto.createHash("sha-256").update(session).digest("hex");

  const [user] = await db.select({
    id: users.id,
    session: {
      id: sessions.id,
      expiresAt: sessions.expiresAt,
      userAgent: sessions.userAgent,
      ip: sessions.ip,
    },

    name: users.name,
    userName: users.userName,
    role: users.role,
    phoneNumber: users.phoneNumber,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt
  })
  .from(sessions)
  .where(eq(sessions.id, hashedToken))
  .innerJoin(users, eq(users.id, sessions.userId))

  return user;
}