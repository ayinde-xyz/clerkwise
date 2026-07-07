import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
const robota = Roboto({ style: "normal", weight: "400" });

export const metadata: Metadata = {
  title: "Clerkwise AI",
  description: "Built using Next.js and Firebase Genkit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robota.className} antialiased`}>{children}</body>
    </html>
  );
}

// ↑ @types/node 20.17.14 → 22.13.1
// ↑ @types/react 19.0.7 → 19.0.8
// ↑ eslint 9.18.0 → 9.20.0
// ↑ eslint-config-next 15.1.5 → 15.1.6
// ↑ genkit-cli 0.9.12 → 1.0.4
// ↑ tailwindcss 3.4.17 → 4.0.4
// ↑ @genkit-ai/googleai 0.9.12 → 1.0.4
// ↑ @radix-ui/react-avatar 1.1.2 → 1.1.3
// ↑ @radix-ui/react-dialog 1.1.5 → 1.1.6
// ↑ @radix-ui/react-dropdown-menu 2.1.5 → 2.1.6
// ↑ @radix-ui/react-label 2.1.1 → 2.1.2
// ↑ @radix-ui/react-radio-group 1.2.2 → 1.2.3
// ↑ @radix-ui/react-select 2.1.4 → 2.1.6
// ↑ @radix-ui/react-separator 1.1.1 → 1.1.2
// ↑ @radix-ui/react-slot 1.1.1 → 1.1.2
// ↑ @radix-ui/react-toast 1.2.4 → 1.2.6
// ↑ @radix-ui/react-tooltip 1.1.6 → 1.1.8
// ↑ firebase 11.2.0 → 11.3.0
// ↑ genkit 0.9.12 → 1.0.4
// ↑ lucide-react 0.473.0 → 0.475.0
// ↑ next 15.1.5 → 15.1.6
// ↑ next-auth 5.0.0-beta.25 → 4.24.11
// ↑ openai 4.79.1 → 4.83.0
// ↑ swr 2.3.0 → 2.3.2
// ↑ tailwind-merge 2.6.0 → 3.0.1

// ↑ @eslint/eslintrc 3.2.0 → 3.3.3
// ↑ @tailwindcss/postcss 4.0.0 → 4.1.18
// ↑ @types/node 22.13.1 → 25.0.10
// ↑ @types/react 19.0.8 → 19.2.9
// ↑ @types/react-dom 19.0.3 → 19.2.3
// ↑ eslint 9.20.0 → 9.39.2
// ↑ eslint-config-next 15.1.6 → 16.1.4
// ↑ genkit-cli 1.0.4 → 1.28.0
// ↑ postcss 8.5.1 → 8.5.6
// ↑ tailwindcss 4.0.0 → 4.1.18
// ↑ typescript 5.7.3 → 5.9.3
// ↑ @auth/firebase-adapter 2.7.4 → 2.11.1
// ↑ @genkit-ai/googleai 1.0.4 → 1.28.0
// ↑ @google/generative-ai 0.21.0 → 0.24.1
// ↑ @hookform/resolvers 3.10.0 → 5.2.2
// ↑ @radix-ui/react-avatar 1.1.3 → 1.1.11
// ↑ @radix-ui/react-dialog 1.1.6 → 1.1.15
// ↑ @radix-ui/react-dropdown-menu 2.1.6 → 2.1.16
// ↑ @radix-ui/react-label 2.1.2 → 2.1.8
// ↑ @radix-ui/react-radio-group 1.2.3 → 1.3.8
// ↑ @radix-ui/react-select 2.1.6 → 2.2.6
// ↑ @radix-ui/react-separator 1.1.2 → 1.1.8
// ↑ @radix-ui/react-slot 1.1.2 → 1.2.4
// ↑ @radix-ui/react-toast 1.2.6 → 1.2.15
// ↑ @radix-ui/react-tooltip 1.1.8 → 1.2.8
// ↑ @vercel/blob 0.27.1 → 2.0.1
// ↑ firebase 11.3.0 → 12.8.0
// ↑ genkit 1.0.4 → 1.28.0
// ↑ lucide-react 0.475.0 → 0.563.0
// ↑ next 15.1.6 → 16.1.4
// ↑ next-auth 5.0.0-beta.25 → 4.24.13
// ↑ react 19.0.0 → 19.2.3
// ↑ react-dom 19.0.0 → 19.2.3
// ↑ react-dropzone 14.3.5 → 14.3.8
// ↑ react-hook-form 7.54.2 → 7.71.1
// ↑ react-hot-toast 2.5.1 → 2.6.0
// ↑ react-icons 5.4.0 → 5.5.0
// ↑ tailwind-merge 3.0.1 → 3.4.0
// ↑ zod 3.24.1 → 4.3.6

// ↑ @eslint/eslintrc 3.3.3 → 3.3.5
// ↑ @react-email/components 1.0.7 → 1.0.12
// ↑ @tailwindcss/postcss 4.1.18 → 4.3.0
// ↑ @types/node 25.0.10 → 25.9.1
// ↑ @types/nodemailer 7.0.9 → 8.0.0
// ↑ @types/pg 8.16.0 → 8.20.0
// ↑ @types/react 19.2.9 → 19.2.15
// ↑ drizzle-kit 0.31.8 → 0.31.10
// ↑ eslint 9.39.2 → 10.4.0
// ↑ eslint-config-next 16.1.4 → 16.2.6
// ↑ genkit-cli 1.28.0 → 1.35.0
// ↑ postcss 8.5.6 → 8.5.15
// ↑ tailwindcss 4.1.18 → 4.3.0
// ↑ typescript 5.9.3 → 6.0.3
// ↑ @better-auth/cli 1.4.20 → 1.4.21
// ↑ @hookform/resolvers 5.2.2 → 5.4.0
// ↑ @langchain/anthropic 1.3.14 → 1.4.0
// ↑ @langchain/core 1.1.31 → 1.1.48
// ↑ @langchain/google 0.1.5 → 0.1.12
// ↑ @vercel/blob 2.0.1 → 2.4.0
// ↑ ai 6.0.62 → 6.0.190
// ↑ axios 1.13.4 → 1.16.1
// ↑ better-auth 1.5.5 → 1.6.11
// ↑ date-fns 4.1.0 → 4.2.1
// ↑ dotenv 17.2.3 → 17.4.2
// ↑ drizzle-orm 0.45.1 → 0.45.2
// ↑ genkit 1.28.0 → 1.35.0
// ↑ langchain 1.2.17 → 1.4.2
// ↑ lucide-react 0.563.0 → 1.16.0
// ↑ next 16.1.4 → 16.2.6
// ↑ nodemailer 8.0.1 → 8.0.7
// ↑ pg 8.17.2 → 8.21.0
// ↑ postgres 3.4.8 → 3.4.9
// ↑ react 19.2.3 → 19.2.6
// ↑ react-dom 19.2.3 → 19.2.6
// ↑ react-dropzone 14.3.8 → 15.0.0
// ↑ react-hook-form 7.71.1 → 7.76.0
// ↑ react-icons 5.5.0 → 5.6.0
// ↑ swr 2.4.0 → 2.4.1
// ↑ tailwind-merge 3.4.0 → 3.6.0
// ↑ tsx 4.21.0 → 4.22.3
// ↑ zod 4.3.6 → 4.4.3
// ↑ zustand 5.0.11 → 5.0.13
