import { Navigate, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MindPalEmbed from "@/components/MindPalEmbed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useCallback } from "react";
import { upsertToolRun, updateToolRun, getToolRunByRunId } from "@/lib/localDB";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/utils/slugify";

const ChatbotPage = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ccid: pathCcid } = useParams();

  const ccid = pathCcid || searchParams.get("ccid");

  const [title, setTitle] = useState("Advanced Generalist AI Assistant");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [pendingTitle, setPendingTitle] = useState<string | null>(null);

  const fetchTitle = useCallback(() => {
    if (!ccid) return;
    const run = getToolRunByRunId(ccid);
    if (run?.tool_name) setTitle(run.tool_name);
  }, [ccid]);

  useEffect(() => {
    fetchTitle();
  }, [fetchTitle]);

  const handleSaveTitle = () => {
    if (!tempTitle.trim()) return;
    const newTitle = tempTitle.trim();
    const newSlug = slugify(newTitle);
    setTitle(newTitle);
    setIsEditing(false);

    if (!ccid || !user?.id) {
      setPendingTitle(newTitle);
      toast.success(t("chat.pending"));
      return;
    }

    navigate(`/chat/${ccid}/${newSlug}`, { replace: true });
    updateToolRun(ccid, { tool_name: newTitle });
    toast.success(t("chat.updated"));
  };

  if (!loading && !user) return <Navigate to="/login" replace />;
  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        {t("common.loading")}
      </div>
    );

  return (
    <div className="container mx-auto flex flex-col px-4 py-6">
      <div className="mb-4 flex items-center gap-2 group">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="bg-background border-b-2 border-primary outline-none text-2xl font-bold text-foreground w-full py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
            <button
              onClick={handleSaveTitle}
              className="p-2 hover:bg-primary/10 rounded-full text-green-500 transition-colors"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-primary/10 rounded-full text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {title}
            </h1>
            <button
              onClick={() => {
                setTempTitle(title);
                setIsEditing(true);
              }}
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded-md transition-all text-muted-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <MindPalEmbed
        slug="advanced-generalist-ai-assistant-8f9"
        type="chatbot"
        conversationId={ccid}
        title={title}
        onConversationStarted={(cid) => {
          const currentTitle = pendingTitle || title;
          const currentSlug = slugify(currentTitle);
          navigate(`/chat/${cid}/${currentSlug}`, { replace: true });

          if (user?.id) {
            upsertToolRun({
              user_id: user.id,
              tool_id: "69c156f9877ca00f73732590",
              tool_name: currentTitle,
              tool_type: "chatbot",
              run_id: cid,
            });
            setPendingTitle(null);
          }
        }}
      />
    </div>
  );
};

export default ChatbotPage;
