"use server";

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

export const registrationAction = async (data: {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: "applicant" | "employer";
}) => {
  try {
    const { name, userName, email, password, role } = data;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email)
        return {
          status: "ERROR",
          message: "Email Already Exists",
        };

      else{
        
        return {
          status: "ERROR",
          message: "UserName Already Exists"
        }
      }
    }

    const hashPassword = await argon2.hash(password);

    await db
      .insert(users)
      .values({ name, userName, email, password: hashPassword, role });
    // Object.fromEntries(formdata.entries());
    // console.log(formdata);

    return {
      status: "SUCCESS",
      message: "Registration Completed Successfully",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};

// This is also a method

// export const registrationAction = async (formdata: FormData) => {
//   const { name, userName, email, password, confirmPassword, role } =
//     Object.fromEntries(formdata.entries());
//   console.log(name, userName, email, password, confirmPassword, role);
//   // console.log(formdata);
// };
