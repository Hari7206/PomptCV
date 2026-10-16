import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export interface AuthenticationFailure {
   name: "AuthenticationError";
   statusCode: 401;
   message: string;
}

export const isAuthenticationFailure = (
   error: unknown
): error is AuthenticationFailure => {
   if (!error || typeof error !== "object") {
      return false;
   }

   const failure = error as Partial<AuthenticationFailure>;
   return failure.name === "AuthenticationError" && failure.statusCode === 401;
};

const createAuthenticationError = (message: string): AuthenticationFailure => ({
   name: "AuthenticationError",
   statusCode: 401,
   message,
});

export async function GetCurrentUser() {
   const cookieStore = await cookies();

   const token = cookieStore.get("token")?.value;

   if (!token) throw createAuthenticationError("Authentication required");

   try {
      const decode = verifyToken(token);

      if (!decode?.userid) {
         throw createAuthenticationError("Invalid authentication token");
      }

      return decode.userid;
   } catch (error) {
      if (isAuthenticationFailure(error)) {
         throw error;
      }

      throw createAuthenticationError("Authentication token expired or invalid");
   }
}
