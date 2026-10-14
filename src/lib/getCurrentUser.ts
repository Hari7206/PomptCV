import { cookies } from "next/headers";
import { verifyToken } from "./jwt";



export async function GetCurrentUser() {
   let cookieStore = await cookies()

   let token = cookieStore.get("token")?.value

   if (!token) throw new Error("No token found");

   const decode = verifyToken(token)

   if (!decode) throw new Error("unauthorized");
   console.log("decoded token:", decode);
   return decode.userid

}

