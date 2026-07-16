import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { poppins, archivo } from "@/app/fonts";
import Image from "next/image";
import logo from "@/app/icon.svg";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginButton } from "@/components/auth/loginbutton";

export default async function Home() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  const isAuthenticated = !!(session && session.user);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Header / Navbar */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 px-6 z-10 dark:text-zinc-100">
        <div className="flex items-center gap-2">
          <Image
            src={logo}
            alt="ClerkWise Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
          <span
            className={cn(
              "text-xl font-bold text-gray-800 dark:text-zinc-100",
              archivo.className,
            )}>
            ClerkWise
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href="/chat">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center space-y-8 my-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 px-3 py-1 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Designed for Medical Students
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg dark:shadow-none">
                <Image
                  src={logo}
                  alt="Clerkwise AI Logo"
                  height={150}
                  width={150}
                  className="dark:invert"
                />
              </div>
            </div>

            <h1
              className={cn(
                "text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-none dark:from-blue-400 dark:via-purple-400 dark:to-blue-200",
                poppins.className,
              )}>
              Clerkwise AI
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              An intelligent AI companion that assists medical students to clerk
              based on presenting complaints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold shadow-lg dark:shadow-none transition-all duration-300">
                  Continue to Chat
                </Button>
              </Link>
            ) : (
              <LoginButton asChild>
                <Button
                  size="lg"
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold shadow-lg dark:shadow-none transition-all duration-300">
                  Get Started Free
                </Button>
              </LoginButton>
            )}

            <Link href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full px-8 py-3 text-lg border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full my-12">
          <div className="text-center md:text-left mb-8">
            <h2
              className={cn(
                "text-3xl font-bold text-gray-800 dark:text-zinc-100",
                poppins.className,
              )}>
              Powerful Clerking Capabilities
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 mt-2">
              Train with advanced clinical reasoning support built directly into
              your simulator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full justify-between">
              <div>
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2 text-center md:text-left">
                  Interactive Simulator
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  Practice clerking virtual patients with diverse clinical
                  complaints in real-time.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full justify-between">
              <div>
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2 text-center md:text-left">
                  Multi-Model Support
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  Powered by advanced models like Gemini, GPT-4, and Claude for
                  diverse clinical scenarios.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full justify-between">
              <div>
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2 text-center md:text-left">
                  Structured Feedback
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  Get instant differential diagnosis generation and structured
                  summaries.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full justify-between">
              <div>
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2 text-center md:text-left">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  Your conversations, practice sessions, and data are protected
                  and confidential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full my-12">
          <h2
            className={cn(
              "text-3xl font-bold text-gray-800 dark:text-zinc-100 text-center mb-8",
              archivo.className,
            )}>
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center relative">
            {/* Step 1 */}
            <div
              data-testid="step"
              className="step-card bg-zinc-100/80 dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800/50 transition-all duration-300 flex flex-col items-center text-center relative hover:shadow-md dark:shadow-none">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2">
                Input Chief Complaint
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Input the patient's presenting chief complaints to spin up a
                case simulator.
              </p>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-zinc-700 z-10"></div>
            </div>

            {/* Step 2 */}
            <div
              data-testid="step"
              className="step-card bg-zinc-100/80 dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800/50 transition-all duration-300 flex flex-col items-center text-center relative hover:shadow-md dark:shadow-none">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2">
                Interview & Clerk
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Conduct a simulated clinical history interview asking critical
                questions.
              </p>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-zinc-700 z-10"></div>
            </div>

            {/* Step 3 */}
            <div
              data-testid="step"
              className="step-card bg-zinc-100/80 dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800/50 transition-all duration-300 flex flex-col items-center text-center relative hover:shadow-md dark:shadow-none">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2">
                Generate Summary
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Receive a diagnostic summary report with structured feedback on
                your performance.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-900/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Footer Section */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 z-10 flex flex-col">
        <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="ClerkWise Logo"
                width={24}
                height={24}
                className="dark:invert"
              />
              <span
                className={cn(
                  "text-lg font-bold text-gray-800 dark:text-zinc-100",
                  archivo.className,
                )}>
                ClerkWise
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              The premium AI companion designed to help medical students master
              history-taking.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/chat"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Start Clerking
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              Copyright
            </h4>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              © {new Date().getFullYear()} ClerkWise. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Built by{" "}
              <Link href="https://ayindeabdulrahman.xyz" aria-label="ayinde-xyz">
                <span>ayinde-xyz</span>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
