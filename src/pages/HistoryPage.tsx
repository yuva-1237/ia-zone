import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getToolRuns,
  deleteToolRunById,
  deleteAllToolRuns,
  LocalToolRun,
} from "@/lib/localDB";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/utils/slugify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const toolPageMap: Record<string, string> = {
  "69c156f9877ca00f73732590": "/tool/advanced-generalist-ai-assistant",
};

const HistoryPage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<LocalToolRun[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchedRuns = getToolRuns(user.id);
    setRuns(fetchedRuns);
    setFetching(false);
  }, [user]);

  if (!loading && !user) return <Navigate to="/login" replace />;

  const handleResume = (run: LocalToolRun) => {
    if (run.tool_type === "chatbot") {
      const slug = slugify(run.tool_name || "chat");
      navigate(`/chat/${run.run_id}/${slug}`);
    } else {
      const basePath = toolPageMap[run.tool_id] || "/";
      navigate(`${basePath}?wrid=${run.run_id}`);
    }
  };

  const handleDelete = (id: string) => {
    deleteToolRunById(id);
    setRuns((prev) => prev.filter((r) => r.id !== id));
    toast.success(t("chat.updated"));
  };

  const handleClearAll = () => {
    if (!user) return;
    deleteAllToolRuns(user.id);
    setRuns([]);
    toast.success(t("common.deleted") || "Histories deleted");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">
          {t("history.title")}
        </h1>
        {runs.length > 0 && !fetching && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.clearAll") || "Clear All"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("common.confirm")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("history.clearAllDescription") ||
                    "This will permanently delete all your usage history. This action cannot be undone."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("common.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {fetching ? (
        <p className="mt-8 text-muted-foreground">{t("common.loading")}</p>
      ) : runs.length === 0 ? (
        <p className="mt-8 text-muted-foreground">{t("history.empty")}</p>
      ) : (
        <div className="mt-8 space-y-3">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 card-shadow"
            >
              <div>
                <p className="font-medium text-card-foreground">
                  {run.tool_name || "AI Tool"}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {run.tool_type}
                  </Badge>
                  <span>{new Date(run.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResume(run)}
                >
                  <Play className="mr-1 h-3 w-3" />
                  {t("history.resume")}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("common.confirm")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("common.deleteDescription") ||
                          "This will permanently delete this chat from your history."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(run.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t("common.delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
