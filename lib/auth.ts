import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/drizzle/schema";
import { sendEmailAction } from "@/actions/reset";

const cookieDomain: string | undefined =
  process.env.VERCEL === "1"
    ? process.env.VERCEL_ENV === "production"
      ? "gemini-clone-eta-weld.vercel.app"
      : process.env.VERCEL_ENV === "preview"
        ? `.${process.env.VERCEL_URL}`
        : undefined
    : undefined;

export const auth = betterAuth({
  appName: "Neuralis AI",
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Password Reset Request",
        description:
          "You requested a password reset. Click the button below to reset your password,",
        link: url,
      });
    },
    // requireEmailVerification: true,
    // resetPasswordTokenExpiresIn: 60 * 60,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    },
    // tiktok: {
    //   clientKey: process.env.TIKTOK_CLIENT_ID as string,
    //   clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
    // },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Verify your Email Address",
        description:
          "Welcome to Neuralis AI! Please verify your email address by clicking the button below.",
        link: url,
      });
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },

  plugins: [nextCookies()],

  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: cookieDomain,
    },
    trustedOrigins: [
      "http://localhost:3000",
      "https://gemini-clone-eta-weld.vercel.app",
    ],
  },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
