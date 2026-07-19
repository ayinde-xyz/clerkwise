import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import logo from "@/app/icon.svg";
import { poppins, archivo } from "@/app/fonts";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300 flex flex-col justify-between p-6 relative overflow-hidden">
      <Toaster />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-2 px-4 z-10 dark:text-zinc-100 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="ClerkWise Logo" width={28} height={28} />
          <span
            className={cn(
              "text-lg font-bold text-gray-800 dark:text-zinc-100",
              archivo.className,
            )}>
            ClerkWise
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-10 items-center z-10">
        {/* Left: Hero (hidden on small screens) */}
        <section className="hidden md:block space-y-6">
          <div className="flex">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg dark:shadow-none">
              <Image
                src={logo}
                alt="ClerkWise Logo"
                width={36}
                height={36}
                className="dark:invert"
              />
            </div>
          </div>

          <h1
            className={cn(
              "text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-none dark:from-blue-400 dark:via-purple-400 dark:to-blue-200",
              poppins.className,
            )}>
            Clerkwise AI
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-300 max-w-lg leading-relaxed">
            The premium AI companion designed for medical students to master
            history-taking and clinical clerking.
          </p>

          <div className="grid grid-cols-1 gap-4 max-w-lg">
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-zinc-100 mb-1">
                Interactive Simulator
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Practice history-taking guided by structured clinical
                frameworks.
              </p>
            </div>

            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-zinc-100 mb-1">
                Structured Feedback
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Get differential diagnosis generation and structured summaries.
              </p>
            </div>

            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-zinc-100 mb-1">
                Secure & Private
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                All your chats and clinical simulations are secure.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Auth card */}
        <aside className="w-full flex items-center justify-center">
          <div className="w-full max-w-sm space-y-6 bg-white/70 dark:bg-zinc-900/80 backdrop-blur p-6 rounded-xl shadow-lg dark:shadow-none border border-white/20 dark:border-zinc-800/50">
            <div>{children}</div>

            <p className="text-center text-xs text-gray-500 dark:text-zinc-400">
              By continuing you agree to our terms and privacy policy.
            </p>
          </div>
        </aside>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-900/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-900/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
    </main>
  );
};

export default AuthLayout;
