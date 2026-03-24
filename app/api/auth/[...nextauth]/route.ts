import { authOptions } from "@/Components/lib/authoptions"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"




const handler =NextAuth(authOptions)
export {handler as Get, handler as POST}