import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { workflow_run_id, workflow_id, workflow_title, custom_user_id } = body;

    if (!workflow_run_id || !custom_user_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Deduplication check
    const { data: existing } = await supabase
      .from("tool_runs")
      .select("id")
      .eq("run_id", workflow_run_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ message: "Already recorded" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("tool_runs").insert({
      user_id: custom_user_id,
      tool_id: workflow_id || "",
      tool_name: workflow_title || "AI Workflow",
      tool_type: "workflow",
      run_id: workflow_run_id,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
