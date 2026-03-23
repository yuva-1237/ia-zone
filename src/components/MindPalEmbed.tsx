import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface MindPalEmbedProps {
  slug: string;
  type: "chatbot" | "workflow";
  conversationId?: string | null;
  workflowRunId?: string | null;
}

const MindPalEmbed = ({ slug, type, conversationId, workflowRunId }: MindPalEmbedProps) => {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const domain = type === "chatbot" ? "chatbot.getmindpal.com" : "workflow.getmindpal.com";
  const idSuffix = type === "chatbot" ? "-chatbot" : "-workflow";
  const iframeId = `${slug}${idSuffix}`;

  let src = `https://${domain}/${slug}`;
  if (theme === "dark") src += "?theme=dark";
  if (conversationId) src += `${theme === "dark" ? "&" : "?"}ccid=${conversationId}`;
  if (workflowRunId) src += `${theme === "dark" ? "&" : "?"}wrid=${workflowRunId}`;

  useEffect(() => {
    // Set config on window
    (window as any).mindpalIframeConfig = {
      ...(window as any).mindpalIframeConfig,
      [iframeId]: {
        customUserId: user?.id || "",
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

    return () => {
      const s = document.querySelector(`script[data-target="${iframeId}"]`);
      if (s) s.remove();
    };
  }, [iframeId, user?.id, profile?.full_name, domain]);

  return (
    <div ref={containerRef} className="flex w-full flex-1 flex-col">
      <div className="relative overflow-hidden rounded-xl border border-border bg-background">
        <iframe
          id={iframeId}
          src={src}
          allow="clipboard-read; clipboard-write; microphone"
          className="h-full min-h-[700px] w-full border-none"
        />
        {/* Attribution Mask & Custom Branding */}
        <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-center border-t border-border bg-background z-20">
          <div className="text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://linktr.ee/Yuvathilagan"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
            >
              yuvathilagan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindPalEmbed;
