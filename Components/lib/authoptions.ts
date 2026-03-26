import { loginuser } from "@/actions/server/auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials) {
        const user = await loginuser(credentials);

        if (!user) return null;

        // console.log(user)

        return {
          id: user.user.id.toString(),
          name: user.user.name,
          email: user.user.email,
          accountType: user.user.accountType,
          messName: user.user.messName,
          selectedMess: user.user.selectedMess,
          messSecretCode: user.user.messSecretCode,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.accountType = (user as any).accountType;
        token.messName = (user as any).messName;
        token.selectedMess = (user as any).selectedMess;
        token.messSecretCode = (user as any).messSecretCode;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        accountType: token.accountType as string,
        messName: token.messName as string,
        selectedMess: token.selectedMess as string,
         messSecretCode: token.messSecretCode as string,
      };
      return session;
    },
  },
};