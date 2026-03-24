import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

interface ToolRun {
  id: string;
  tool_id: string;
  tool_name: string;
  tool_type: string;
  run_id: string;
  created_at: string;
}

const toolPageMap: Record<string, string> = {
  "69c156f9877ca00f73732590": "/tool/advanced-generalist-ai-assistant",
};

const HistoryPage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<ToolRun[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    const fetchRuns = async () => {
      const { data } = await supabase
        .from("tool_runs")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      setRuns((data as ToolRun[]) || []);
      setFetching(false);
    };

    fetchRuns();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("history_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tool_runs",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRuns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!loading && !user) return <Navigate to="/login" replace />;

  const handleResume = (run: ToolRun) => {
    const basePath = toolPageMap[run.tool_id] || "/";
    if (run.tool_type === "chatbot") {
      navigate(`${basePath}?ccid=${run.run_id}`);
    } else {
      navigate(`${basePath}?wrid=${run.run_id}`);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("tool_runs")
      .update({ is_deleted: true })
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete history");
    } else {
      setRuns(runs.filter((r) => r.id !== id));
      toast.success("History deleted");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">{t("history.title")}</h1>
      {fetching ? (
        <p className="mt-8 text-muted-foreground">Loading...</p>
      ) : runs.length === 0 ? (
        <p className="mt-8 text-muted-foreground">{t("history.empty")}</p>
      ) : (
        <div className="mt-8 space-y-3">
          {runs.map((run) => (
            <div key={run.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 card-shadow">
              <div>
                <p className="font-medium text-card-foreground">{run.tool_name || "AI Tool"}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">{run.tool_type}</Badge>
                  <span>{new Date(run.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleResume(run)}>
                  <Play className="mr-1 h-3 w-3" />
                  {t("history.resume")}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this chat from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(run.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
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
