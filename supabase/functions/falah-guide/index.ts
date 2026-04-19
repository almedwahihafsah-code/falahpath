const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  mood?: string;
  situation?: string;
  domain?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { mood, situation, domain }: Body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const userPrompt = `حال المستخدم اليوم:
- الشعور: ${mood || "غير محدد"}
- الموقف: ${situation || "غير محدد"}
- المجال المهتم به: ${domain || "أي مجال"}

اقترح عليه إرشادًا قرآنيًا عمليًا.`;

    const systemPrompt = `أنت مرشد قرآني حكيم ضمن "منهج الفلاح". مهمتك تقديم إرشاد عملي ولطيف بالعربية الفصحى.
- اعتمد فقط على القرآن الكريم والسنة الصحيحة.
- اقتبس آيةً واحدة موثوقة (مع اسم السورة ورقم الآية).
- اقترح 3 سلوكيات يومية بسيطة قابلة للتنفيذ اليوم.
- اربط الإرشاد بأحد المجالات الثمانية: القلب والروح، الجسد والصحة، العقل والمعرفة، العمل والإنجاز، المال والموارد، الأسرة والعلاقات، المجتمع والأمة، الابتلاءات والأزمات.
- كن موجزًا ومُلهِمًا، لا تطل.`;

    const tool = {
      type: "function",
      function: {
        name: "falah_guidance",
        description: "إرشاد قرآني عملي للمستخدم",
        parameters: {
          type: "object",
          properties: {
            verse_arabic: { type: "string", description: "نص الآية بالعربية بدون أقواس" },
            verse_reference: { type: "string", description: "اسم السورة ورقم الآية، مثل: الرعد 28" },
            domain: { type: "string", description: "اسم المجال المرتبط من المجالات الثمانية" },
            reflection: { type: "string", description: "تأمل قصير في الآية (جملتان)" },
            actions: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: { type: "string" },
              description: "ثلاثة سلوكيات يومية قابلة للتنفيذ"
            },
            dua: { type: "string", description: "دعاء قصير مناسب للحال" }
          },
          required: ["verse_arabic", "verse_reference", "domain", "reflection", "actions", "dua"],
          additionalProperties: false,
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "falah_guidance" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات. حاول بعد قليل." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "نفدت أرصدة المساعد الذكي. يرجى إضافة رصيد." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "تعذّر الحصول على الإرشاد" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call in response");
    const guidance = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify({ guidance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("falah-guide error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
