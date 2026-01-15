import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const isGoogleConfigured = Boolean(clientId && clientSecret);

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: isGoogleConfigured
    ? [
        Google({
          clientId: clientId as string,
          clientSecret: clientSecret as string,
        }),
      ]
    : [],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
