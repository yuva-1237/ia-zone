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
    const { conversationId, chatbotId, chatbotName, customUserId } = body;

    if (!conversationId || !customUserId) {
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
      .select("id, is_deleted")
      .eq("run_id", conversationId)
      .maybeSingle();

    if (existing) {
      // If it exists but was deleted, we stay quiet
      return new Response(JSON.stringify({ message: "Already recorded" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("tool_runs").insert({
      user_id: customUserId,
      tool_id: chatbotId || "",
      tool_name: chatbotName || "AI Chatbot",
      tool_type: "chatbot",
      run_id: conversationId,
      is_deleted: false,
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
