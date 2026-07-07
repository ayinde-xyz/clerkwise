import { LoginButton } from "@/components/auth/loginbutton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Poppins } from "next/font/google";
import { headers } from "next/headers";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/chat");
  }
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>

          <h1
            className={cn(
              "text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent",
              font.className,
            )}>
            Clerkwise AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your intelligent AI companion for instant answers, creative ideas,
            and meaningful conversations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Smart Responses
            </h3>
            <p className="text-gray-600">
              Get accurate, context-aware answers to your questions
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Experience instant responses with our optimized AI
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your conversations are protected and confidential
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            Ready to start chatting? Join thousands of users who trust our AI
            assistant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LoginButton asChild>
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
              </Button>
            </LoginButton>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300">
              Learn More
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </main>
  );
}
