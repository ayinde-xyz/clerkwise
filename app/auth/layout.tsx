import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { Poppins, Megrim } from "next/font/google";
import Logo from "@/public/icon.svg";

const megrim = Megrim({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-6">
      <Toaster />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Hero (hidden on small screens) */}
        <section className="hidden md:block space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>

          <h1
            className={`text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent ${poppins.className}`}>
            Clerkwise AI
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
            Your intelligent AI companion for instant answers, creative ideas,
            and meaningful conversations.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow border border-white/20">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Smart Responses
              </h3>
              <p className="text-gray-600">
                Get accurate, context-aware answers.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Experience instant responses with optimized AI.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow border border-white/20">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your conversations are protected and confidential.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Auth card */}
        <aside className="w-full flex items-center justify-center">
          <div className="w-full max-w-sm space-y-6 bg-white/60 backdrop-blur p-6 rounded-xl shadow-lg border border-white/20">
            <div>{children}</div>

            <p className="text-center text-sm text-gray-500">
              By continuing you agree to our terms and privacy policy.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AuthLayout;
