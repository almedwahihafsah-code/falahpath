const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { verse_id } = await req.json();
    if (!verse_id) return json({ error: "verse_id required" }, 400);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const vRes = await fetch(`${SUPABASE_URL}/rest/v1/verses?id=eq.${verse_id}&select=*`, {
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}` },
    });
    const verses = await vRes.json();
    const verse = verses[0];
    if (!verse) return json({ error: "verse not found" }, 404);

    const systemPrompt = `أنت خبير في تصنيف آيات القرآن وفق نظام الفلاح ذي الست طبقات:
1. المجال (domain_code): A=الله والغيبيات، B=الإنسان، C=الكون، D=الهداية والتشريع، E=الحياة العملية، F=المصير والآخرة
2. الوظيفة الخطابية (function): أمر، نهي، وعد، وعيد، قصة، مثل، حوار، تقرير، تعزية، تحفيز، تصحيح
3. السياق (context): مكية أو مدنية
4. المحاور (themes): التوحيد، الابتلاء، التمكين، الصبر، الشكر، التوبة، الحكمة، العدل، الرحمة، الإيمان، النفاق، الكفر، الجهاد، الأسرة، المال
5. الأثر التربوي (educational_effects): بناء_الإيمان، تزكية_النفس، تصحيح_السلوك، إحياء_الرجاء، تثبيت_القلب، تنمية_الوعي
6. العلامات (tags): #سنة_إلهية، #تمكين، #قيادة، #تحول، #ابتلاء، #نصر، #هداية، #تشريع
أرجع تصنيفًا دقيقًا مع تأمل قصير في حقل notes.`;

    const userPrompt = `صنّف هذه الآية من سورة البقرة (آية ${verse.verse_number}):\n${verse.text_ar}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "classify",
            description: "Return a Quranic verse classification.",
            parameters: {
              type: "object",
              properties: {
                domain_code: { type: "string", enum: ["A","B","C","D","E","F"] },
                function: { type: "string" },
                context: { type: "string", enum: ["مكية","مدنية"] },
                themes: { type: "array", items: { type: "string" } },
                educational_effects: { type: "array", items: { type: "string" } },
                tags: { type: "array", items: { type: "string" } },
                notes: { type: "string" },
              },
              required: ["domain_code","function","themes","notes"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "classify" } },
      }),
    });

    if (aiRes.status === 429) return json({ error: "تم تجاوز الحد، حاول لاحقًا" }, 429);
    if (aiRes.status === 402) return json({ error: "نفدت الأرصدة" }, 402);
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI error:", aiRes.status, t);
      return json({ error: "AI gateway error" }, 500);
    }

    const data = await aiRes.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const suggestion = args ? JSON.parse(args) : {};
    return json({ suggestion });
  } catch (e) {
    console.error("classify-verse error:", e);
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
