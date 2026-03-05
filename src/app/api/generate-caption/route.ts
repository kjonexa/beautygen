import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TemplateId } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

const HASHTAG_MAP: Record<TemplateId, string[]> = {
  "makeup-steps":         ["#makeuptutorial", "#makeuptips", "#tutorialmakeup", "#makeupindonesia", "#beautyindonesia", "#makeuplook", "#makeuplife", "#grwm", "#makeuptiktok"],
  "daily-routine":        ["#skincarerutinitas", "#skincareindo", "#skincareroutine", "#dailyroutine", "#skincaretips", "#glowingskin", "#skincareindonesia", "#rutinitas", "#selfcare"],
  "skin-tone-guide":      ["#skintone", "#foundationshade", "#makeupforwoc", "#kulitgelap", "#beautytips", "#makeupguide", "#skintoneguide", "#inclusivebeauty", "#makeupindo"],
  "acne-guide":           ["#acnetips", "#skincare", "#jerawat", "#acnecare", "#skincareacne", "#clearskintips", "#skinbarriercare", "#kulitsehat", "#skincareindonesia"],
  "makeup-tutorial":      ["#makeuptutorial", "#grwm", "#tutorialmakeup", "#makeuplook", "#makeupindonesia", "#makeuptips", "#beautytips", "#makeuplife", "#makeuptiktok"],
  "lip-products":         ["#lipproduct", "#lipstick", "#lipmakeup", "#lipswatch", "#beautyhaul", "#lipcare", "#lipreview", "#makeuphaul", "#beautyindonesia"],
  "skincare-ingredients": ["#skincareingredients", "#bahanaktif", "#skincaretips", "#ingredientcheck", "#skinscience", "#skinbarrier", "#skincareeducation", "#beautyedu", "#skincaregeek"],
  "clean-makeup":         ["#cleanmakeup", "#naturalmakeup", "#nomakeupmakeup", "#minimalbeauty", "#softmakeup", "#naturalbeauty", "#cleanbeauty", "#glowup", "#softglam"],
  "makeup-checklist":     ["#makeupcollection", "#makeuphaul", "#makeupstarter", "#beautyessentials", "#makeupwajib", "#makeupbeginner", "#makeupindo", "#toolsmakeup", "#beautykit"],
  "no-makeup-look":       ["#nomakeupmakeup", "#bareskin", "#glassskin", "#dewykin", "#skincarefirst", "#naturalbeauty", "#glowingskin", "#kulitsehat", "#skincareindo"],
  "product-comparison":   ["#productreview", "#beautyreview", "#manalebihbagus", "#productcomparison", "#beautyindo", "#jujuraja", "#reviewjujur", "#beautytest", "#swatchtest"],
  "beauty-annotated":     ["#beautylook", "#makeupbreakdown", "#makeupdetail", "#fullfaceofmakeup", "#makeupinspo", "#beautyinspiration", "#grwm", "#makeuplook", "#beautytutorial"],
};

const CAPTION_VOICE = `
Kamu adalah beauty content creator Indonesia usia 23 tahun yang viral.
Audiensmu: cewek Indonesia 17-40 tahun.

Tulis 5 variasi caption yang berbeda gaya dan tone, tapi semua dalam bahasa Indonesia casual + campur English natural.
JANGAN menyebut nama brand. Gunakan istilah generik.
Setiap caption: singkat, punchy, relatable. MAKS 180 karakter untuk teks caption.

5 GAYA WAJIB (PERSIS URUTAN INI):
1. "hook_pertanyaan" — Mulai dengan pertanyaan relatable, buat orang auto stop scroll
2. "bold_opinion" — Statement tegas dengan opini, tidak perlu suka/setuju
3. "pov_storytelling" — POV atau cerita singkat yang relate banget
4. "tutorial_teaser" — Kasih hint tips/step paling penting, bikin penasaran
5. "trending_humor" — Pakai format viral/humor/meme dengan twist beauty

Hashtag: pilih 8-10 hashtag per caption (campuran populer + niche).
Selalu sertakan: #beautyindonesia ATAU #skincareindo di setiap caption.
`;

export async function POST(req: NextRequest) {
  try {
    const { topic, templateId } = (await req.json()) as {
      topic: string;
      templateId: TemplateId;
    };

    if (!topic || !templateId) {
      return NextResponse.json({ error: "topic and templateId are required" }, { status: 400 });
    }

    const baseHashtags = HASHTAG_MAP[templateId] ?? [];

    const prompt = `${CAPTION_VOICE}
Topik konten: "${topic}"
Jenis konten: ${templateId}
Hashtag relevan untuk topik ini (gunakan sebagian): ${baseHashtags.join(", ")}

Return HANYA valid JSON:
{
  "captions": [
    {
      "style": "hook_pertanyaan",
      "label": "Hook Pertanyaan",
      "text": "Caption teks saja, maks 180 karakter",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"]
    },
    { "style": "bold_opinion", "label": "Bold Opinion", "text": "...", "hashtags": [...] },
    { "style": "pov_storytelling", "label": "POV / Story", "text": "...", "hashtags": [...] },
    { "style": "tutorial_teaser", "label": "Tutorial Teaser", "text": "...", "hashtags": [...] },
    { "style": "trending_humor", "label": "Trending / Humor", "text": "...", "hashtags": [...] }
  ]
}`;

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_TEXT_MODEL ?? "gemini-2.5-flash",
      generationConfig: { temperature: 1.3, topP: 0.95, topK: 64 },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = extractJson(text);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Caption error:", err);
    return NextResponse.json({ error: "Gagal generate caption" }, { status: 500 });
  }
}
