import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MindPalEmbed from "@/components/MindPalEmbed";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ChatbotPage = () => {
  const { user, profile, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const ccid = searchParams.get("ccid");

  // No pre-saving "fake" runs anymore as per user request.
  // We will rely on real-time event capture or the webhook.

  if (!loading && !user) return <Navigate to="/login" replace />;
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="container mx-auto flex flex-col px-4 py-6">
      <h1 className="mb-4 font-display text-2xl font-bold text-foreground">Advanced Generalist AI Assistant</h1>
      <MindPalEmbed
        slug="advanced-generalist-ai-assistant-8f9"
        type="chatbot"
        conversationId={ccid}
      />
    </div>
  );
};

export default ChatbotPage;
