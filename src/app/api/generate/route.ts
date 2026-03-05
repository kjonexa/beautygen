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

function stripMarkdown(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/`([^`]+)`/g, "$1");
  }
  if (Array.isArray(obj)) return obj.map(stripMarkdown);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, stripMarkdown(v)])
    );
  }
  return obj;
}

// ── Item counts per format ─────────────────────────────────────────────────────

type Format = "square" | "portrait" | "story";

const COUNTS: Record<Format, { steps: number; items: number; concerns: number }> = {
  square:   { steps: 4, items: 3, concerns: 4 },
  portrait: { steps: 5, items: 3, concerns: 5 },
  story:    { steps: 6, items: 4, concerns: 6 },
};

// ── Creator voice ─────────────────────────────────────────────────────────────

const CREATOR_VOICE = `
Kamu adalah beauty content creator Indonesia usia 23 tahun, viral di TikTok & Instagram.
Audiensmu: cewek Indonesia usia 17-40, kulit tropis, iklim panas-lembap.
Fokus TEKNIK dan PENGETAHUAN — bukan promosi produk.

SUARA DAN GAYA:
- Bahasa sehari-hari Gen Z Indonesia: campur Bahasa + English secara natural
- Punya opini tegas: "ini wajib coba", "jangan skip ini", "deadass game changer"
- Relatable untuk kulit Indonesia: pori-pori besar, kulit berminyak, cuaca panas, flek hitam bekas jerawat
- Singkat dan to the point — kayak caption TikTok, bukan artikel majalah

KONTEKS LOKAL YANG HARUS MASUK:
- Cuaca panas-lembap Indonesia → sweat-proof, oil control, SPF tinggi itu penting
- Kulit sawo matang/NC35+ juga dibahas, bukan cuma fair skin
- Istilah yang familiar: "glass skin", "skin barrier", "double cleanse", "slugging", "tinted moisturizer"

DILARANG KERAS:
- Nama brand atau produk komersial (tidak ada Somethinc, Wardah, Skintific, dll)
- Gunakan istilah generik: "cushion foundation", "BHA toner", "niacinamide serum", "mineral SPF"
- Kata-kata formal/kaku: "selain itu", "perlu diingat", "sangat direkomendasikan", "hendaknya"
- Semua item dengan panjang yang persis sama — variasikan

BATASAN PANJANG — INI KRITIS, JANGAN DILANGGAR:
- Nama step/kategori: MAKS 4 kata
- Deskripsi/detail per item: MAKS 10 kata — frasa pendek, bukan kalimat panjang
- Tip/catatan penutup: MAKS 8 kata
- Ingredient: nama ilmiah + konsentrasi jika ada, maks 6 kata

`;

// ── Template prompts ───────────────────────────────────────────────────────────

const PROMPTS: Record<TemplateId, (topic: string, n: number, ni: number) => string> = {

  "makeup-steps": (topic, n) => `${CREATOR_VOICE}
Buat "Makeup Steps" untuk: "${topic}". Buat tepat ${n} steps.

Return HANYA valid JSON:
{
  "title": "Judul catchy, maks 5 kata, pakai tanda seru",
  "subtitle": "Tagline singkat maks 6 kata (atau null)",
  "steps": [
    { "number": 1, "title": "Nama step maks 3 kata", "description": "Frasa pendek maks 10 kata, sebutkan produk/brand spesifik" }
  ],
  "tip": "Pro tip maks 8 kata (atau null)"
}`,

  "daily-routine": (topic, n) => `${CREATOR_VOICE}
Buat "Daily Routine" untuk: "${topic}". Buat tepat ${n} steps.

Return HANYA valid JSON:
{
  "title": "Judul maks 5 kata",
  "subtitle": "Maks 5 kata (atau null)",
  "steps": [
    { "number": 1, "name": "Nama maks 3 kata", "products": "Brand/produk spesifik maks 8 kata", "tip": "Maks 7 kata (atau null)" }
  ],
  "finalTip": "Maks 8 kata (atau null)"
}`,

  "skin-tone-guide": (topic, n, ni) => `${CREATOR_VOICE}
Buat panduan skin tone untuk: "${topic}". Buat 4 tone, masing-masing ${ni} rekomendasi.

Return HANYA valid JSON:
{
  "title": "Maks 6 kata",
  "tones": [
    {
      "name": "Nama tone maks 3 kata",
      "characteristics": "Ciri khas maks 6 kata",
      "foundationShade": "Range shade maks 5 kata",
      "recommendations": ["Rekomendasi spesifik maks 8 kata", "..."],
      "avoid": "Yang dihindari maks 6 kata (atau null)"
    }
  ]
}`,

  "acne-guide": (topic, n, ni) => `${CREATOR_VOICE}
Buat panduan jenis/masalah untuk: "${topic}". Buat 4 jenis, masing-masing ${ni} ciri dan ${ni} cara atasi.

Return HANYA valid JSON:
{
  "title": "Maks 6 kata",
  "types": [
    {
      "name": "Nama jenis maks 3 kata",
      "color": "#hexcolor soft berbeda tiap jenis",
      "ciri": ["Ciri maks 8 kata", "..."],
      "caraAtasi": ["Cara konkret maks 8 kata, sebutkan bahan/produk", "..."]
    }
  ]
}`,

  "makeup-tutorial": (topic, n) => `${CREATOR_VOICE}
Buat tutorial makeup untuk: "${topic}". Buat tepat ${n} steps.

Return HANYA valid JSON:
{
  "title": "Maks 5 kata",
  "lookName": "Nama look maks 4 kata",
  "steps": [
    { "number": 1, "name": "Nama maks 3 kata", "detail": "Produk + teknik maks 10 kata", "tip": "Maks 7 kata (atau null)" }
  ],
  "note": "Extra touch maks 8 kata (atau null)"
}`,

  "lip-products": (topic, n) => `${CREATOR_VOICE}
Buat panduan produk bibir untuk: "${topic}". Buat tepat ${n} produk.

Return HANYA valid JSON:
{
  "title": "Maks 5 kata",
  "products": [
    {
      "name": "Nama produk maks 3 kata",
      "description": "Esensi maks 7 kata",
      "karakteristik": ["Karakter maks 5 kata", "Karakter", "Karakter"],
      "bestFor": "Situasi maks 6 kata",
      "kekurangan": "Kekurangan maks 5 kata (atau null)"
    }
  ]
}`,

  "skincare-ingredients": (topic, n, ni) => `${CREATOR_VOICE}
Buat cheat sheet kandungan skincare untuk: "${topic}". Buat ${n} concern, masing-masing ${ni} bahan.

Return HANYA valid JSON:
{
  "title": "Maks 7 kata",
  "concerns": [
    {
      "name": "Nama masalah maks 4 kata",
      "ingredients": ["Nama bahan + konsentrasi maks 5 kata", "..."]
    }
  ]
}`,

  "clean-makeup": (topic, n) => `${CREATOR_VOICE}
Buat "Clean/Natural Look" untuk: "${topic}". Buat 4 key points dan ${n} steps.

Return HANYA valid JSON:
{
  "title": "Nama look maks 3 kata, bold",
  "subtitle": "Vibe maks 5 kata",
  "keyPoints": ["Point maks 5 kata", "Point", "Point", "Point"],
  "steps": [
    { "name": "Area maks 2 kata", "tip": "Tips maks 8 kata, sebutkan produk" }
  ],
  "tagline": "Maks 7 kata (atau null)"
}`,

  "makeup-checklist": (topic, n, ni) => `${CREATOR_VOICE}
Buat makeup checklist untuk: "${topic}". Buat ${n} kategori, masing-masing ${ni} items.

Return HANYA valid JSON:
{
  "title": "Maks 5 kata",
  "subtitle": "Maks 6 kata (atau null)",
  "categories": [
    {
      "name": "NAMA KATEGORI maks 3 kata",
      "items": [
        { "text": "Item maks 5 kata", "detail": "Detail maks 7 kata (atau null)" }
      ]
    }
  ]
}`,

  "no-makeup-look": (topic, n, ni) => `${CREATOR_VOICE}
Buat panduan "${topic}" look. Buat ${n} sections, masing-masing ${ni} items.

Return HANYA valid JSON:
{
  "title": "Maks 5 kata",
  "subtitle": "Maks 6 kata (atau null)",
  "sections": [
    {
      "name": "NAMA SECTION maks 3 kata",
      "tip": "Insight kunci maks 7 kata (atau null)",
      "items": ["Produk/teknik spesifik maks 6 kata", "..."]
    }
  ]
}`,

  "product-comparison": (topic, n) => `${CREATOR_VOICE}
Buat tabel perbandingan untuk: "${topic}". Buat 3 produk dan ${n} fitur.

Return HANYA valid JSON:
{
  "title": "Maks 6 kata",
  "products": ["Nama produk maks 3 kata", "Nama", "Nama"],
  "features": [
    { "name": "Fitur maks 3 kata", "values": ["Nilai maks 4 kata", "Nilai", "Nilai"] }
  ]
}`,

  "beauty-annotated": (topic, n) => `${CREATOR_VOICE}
Buat annotated look untuk: "${topic}". Buat ${n} area.

Return HANYA valid JSON:
{
  "title": "Nama look maks 3 kata, bold",
  "subtitle": "Vibe maks 5 kata (atau null)",
  "areas": [
    { "zone": "Nama area maks 2 kata", "product": "Produk spesifik maks 5 kata", "tip": "Teknik maks 7 kata", "icon": "emoji relevan" }
  ],
  "finalNote": "Signature touch maks 8 kata (atau null)"
}`,
};

// ── Route ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { topic, templateId, format = "portrait" } = (await req.json()) as {
      topic: string;
      templateId: TemplateId;
      format?: Format;
    };

    if (!topic || !templateId) {
      return NextResponse.json({ error: "topic and templateId are required" }, { status: 400 });
    }

    const promptFn = PROMPTS[templateId];
    if (!promptFn) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const cnt = COUNTS[format] ?? COUNTS.portrait;
    const prompt = promptFn(topic, cnt.steps, cnt.items);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_TEXT_MODEL ?? "gemini-2.5-flash",
      generationConfig: { temperature: 1.2, topP: 0.95, topK: 64 },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = extractJson(text);

    let content: unknown;
    try {
      content = stripMarkdown(JSON.parse(jsonStr));
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON. Coba lagi." }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Gagal generate konten. Silakan coba lagi." }, { status: 500 });
  }
}
