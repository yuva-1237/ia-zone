import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { upsertToolRun, getToolRunByRunId } from "@/lib/localDB";
import { slugify } from "@/utils/slugify";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface MindpalWindowConfig {
  [key: string]: {
    theme: string;
    accentColor: string;
    customUserId: string;
    conversationId: string;
    workflowRunId: string;
    customSessionContext: { full_name: string };
  };
}

declare global {
  interface Window {
    mindpalIframeConfig?: MindpalWindowConfig;
  }
}

interface MindPalEmbedProps {
  slug: string;
  type: "chatbot" | "workflow";
  conversationId?: string | null;
  workflowRunId?: string | null;
  title?: string;
  onConversationStarted?: (cid: string) => void;
}

const MindPalEmbed = ({ slug, type, conversationId, workflowRunId, onConversationStarted, title }: MindPalEmbedProps) => {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [initialCid] = useState(conversationId);
  const [initialWrid] = useState(workflowRunId);

  const domain = type === "chatbot" ? "chatbot.getmindpal.com" : "workflow.getmindpal.com";
  const idSuffix = type === "chatbot" ? "-chatbot" : "-workflow";
  const iframeId = `${slug}${idSuffix}`;

  const url = new URL(`https://${domain}/${slug}`);
  if (theme === "dark") {
    url.searchParams.append("theme", "dark");
    url.searchParams.append("accentColor", "#A855F7");
    url.searchParams.append("textColor", "#FFFFFF");
  }
  
  // Use the initial IDs to prevent iframe reloads when the parent syncs the IDs back down
  const cidToUse = initialCid || conversationId;
  const wridToUse = initialWrid || workflowRunId;
  
  if (cidToUse) url.searchParams.append("ccid", cidToUse);
  if (wridToUse) url.searchParams.append("wrid", wridToUse);
  
  const handleShare = async () => {
    let shareUrl = window.location.href;
    if (conversationId) {
      const slug = slugify(title || "chat");
      shareUrl = `${window.location.origin}/chat/${conversationId}/${slug}`;
    }

    const shareData = {
      title: title || "IA ZONE - Chat",
      text: `Check out this AI assistant chat on IA ZONE!`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error("Failed to share link.");
      }
    }
  };

  const src = url.toString();
  useEffect(() => {
    // Set config on window
    window.mindpalIframeConfig = {
      ...window.mindpalIframeConfig,
      [iframeId]: {
        theme: theme,
        accentColor: "#A855F7", // Consistent with our primary color
        customUserId: user?.id || "",
        conversationId: conversationId || "",
        workflowRunId: workflowRunId || "",
        customSessionContext: {
          full_name: profile?.full_name || "",
        },
      },
    };

    // Load iframe script
    const existingScript = document.querySelector(`script[data-target="${iframeId}"]`);
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = `https://${domain}/iframe.min.js`;
    script.setAttribute("data-target", iframeId);
    document.body.appendChild(script);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes("getmindpal.com")) {
        // Standardize data - some versions use conversationId, some use cid
        const eventData = event.data;
        const eventType = eventData.type;
        const cid = eventData.conversationId || eventData.cid || eventData.runId;
        const chatbotId = eventData.chatbotId;
        const chatbotName = eventData.chatbotName;

        if (eventType && (eventType.includes("started") || eventType.includes("sent") || eventType.includes("ready"))) {
          console.log("MindPal Captured CID:", cid);
          if (cid && user?.id) {
            // Update URL/parent if ccid is missing from parent state
            if (conversationId !== cid && onConversationStarted) {
              onConversationStarted(cid);
            }

            const dynamicName = `${chatbotName || "Chat"} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            const existing = getToolRunByRunId(cid);
            const shouldUpdateTitle =
              !existing ||
              existing.tool_name === "Advanced Generalist AI Assistant" ||
              existing.tool_name === "Chatbot";

            upsertToolRun({
              user_id: user.id,
              tool_id: chatbotId || "69c156f9877ca00f73732590",
              tool_type: "chatbot",
              run_id: cid,
              ...(shouldUpdateTitle ? { tool_name: dynamicName } : {}),
            });
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      const s = document.querySelector(`script[data-target="${iframeId}"]`);
      if (s) s.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeId, user?.id, profile?.full_name, domain, conversationId, theme, workflowRunId, onConversationStarted]);

  return (
    <div ref={containerRef} className="flex w-full flex-1 flex-col shadow-2xl">
      <div className="relative overflow-hidden rounded-xl border border-white/10 dark:border-white/5 bg-white dark:bg-[#1a1a1a]">
        <iframe
          id={iframeId}
          src={src}
          allow="clipboard-read; clipboard-write; microphone"
          className="h-full min-h-[700px] w-full border-none bg-white dark:bg-[#1a1a1a]"
          style={{ 
            colorScheme: theme === "dark" ? "dark" : "light",
            filter: theme === "dark" ? "brightness(1.5) contrast(1.2)" : "none"
          }}
        />
        {/* Attribution Mask & Custom Branding */}
        <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-between px-6 border-t border-white/10 bg-white dark:bg-[#1a1a1a] z-20">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Created by{" "}
            <a
              href="https://linktr.ee/Yuvathilagan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              yuvathilagan
            </a>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Share Chat
          </button>
        </div>
      </div>
    </div>
  );
};


export default MindPalEmbed;
