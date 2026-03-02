import AppSidebar from "@/components/chat/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
      <Toaster />
    </SidebarProvider>
  );
};

export default ChatLayout;
