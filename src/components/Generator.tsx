"use client";

import { useRef, useState, useCallback } from "react";
import type { ColorTheme, TemplateId, TemplateContent } from "@/types";
import { THEMES } from "@/lib/themes";
import MakeupSteps from "./templates/MakeupSteps";
import DailyRoutine from "./templates/DailyRoutine";
import SkinToneGuide from "./templates/SkinToneGuide";
import AcneGuide from "./templates/AcneGuide";
import MakeupTutorial from "./templates/MakeupTutorial";
import LipProducts from "./templates/LipProducts";
import SkincareIngredients from "./templates/SkincareIngredients";
import CleanMakeup from "./templates/CleanMakeup";
import MakeupChecklist from "./templates/MakeupChecklist";
import NoMakeupLook from "./templates/NoMakeupLook";
import ProductComparison from "./templates/ProductComparison";
import BeautyAnnotated from "./templates/BeautyAnnotated";

// ── Social formats ─────────────────────────────────────────────────────────────

const DISPLAY_W = 400;

const SOCIAL_FORMATS = [
  { id: "square",   name: "Feed Square",  desc: "1:1",  displayH: 400, outputW: 1080, outputH: 1080,  imgH: 200 },
  { id: "portrait", name: "Feed Portrait", desc: "4:5", displayH: 500, outputW: 1080, outputH: 1350,  imgH: 250 },
  { id: "story",    name: "Story / Reel", desc: "9:16", displayH: 711, outputW: 1080, outputH: 1920,  imgH: 355 },
] as const;

type SocialFormatId = (typeof SOCIAL_FORMATS)[number]["id"];

// ── Templates ──────────────────────────────────────────────────────────────────

const TEMPLATES: { id: TemplateId; name: string; icon: string; desc: string }[] = [
  { id: "makeup-steps",          name: "Steps Makeup",    icon: "✨", desc: "Langkah per langkah" },
  { id: "daily-routine",         name: "Daily Routine",   icon: "🌅", desc: "Rutinitas pagi/malam" },
  { id: "skin-tone-guide",       name: "Skin Tone",       icon: "🎨", desc: "Guide shade & warna" },
  { id: "acne-guide",            name: "Problem Kulit",   icon: "🔬", desc: "Jerawat & masalah kulit" },
  { id: "makeup-tutorial",       name: "Tutorial",        icon: "💄", desc: "Step by step look" },
  { id: "lip-products",          name: "Produk Bibir",    icon: "💋", desc: "Lip product guide" },
  { id: "skincare-ingredients",  name: "Bahan Aktif",     icon: "🧪", desc: "Ingredient cheat sheet" },
  { id: "clean-makeup",          name: "Clean Look",      icon: "🌸", desc: "Natural & effortless" },
  { id: "makeup-checklist",      name: "Checklist",       icon: "✅", desc: "Daftar produk lengkap" },
  { id: "no-makeup-look",        name: "No-Makeup",       icon: "🫧", desc: "Kulit sehat glowing" },
  { id: "product-comparison",    name: "Komparasi",       icon: "📊", desc: "Banding 3 produk" },
  { id: "beauty-annotated",      name: "Annotated Look",  icon: "🗺️", desc: "Visual breakdown look" },
];

// ── Quick topic suggestions ────────────────────────────────────────────────────

const QUICK_TOPICS = [
  "Glass skin Korea",
  "Kulit berminyak tropis",
  "Igari makeup",
  "Skincare kulit gelap",
  "Makeup natural school",
  "Skin barrier repair",
  "Sunscreen pagi hari",
  "Dewy look Indonesia",
];

// ── Color themes ──────────────────────────────────────────────────────────────

const COLOR_THEMES: { id: ColorTheme; name: string; vibe: string; preview: string[] }[] = [
  { id: "rose",     name: "Rose Pink",   vibe: "girly aesthetic",   preview: ["#FFF0F3", "#C2185B", "#F8BBD9"] },
  { id: "cream",    name: "Nude Cream",  vibe: "clean & minimal",   preview: ["#FAF5EF", "#8B5E3C", "#F0DDD0"] },
  { id: "sage",     name: "Sage Green",  vibe: "fresh & alami",     preview: ["#F2F6F0", "#3A6B48", "#C8E6C9"] },
  { id: "lavender", name: "Lavender",    vibe: "soft & dreamy",     preview: ["#F5F2FF", "#6B3FA0", "#E1CEF7"] },
  { id: "dark",     name: "Dark Mode",   vibe: "bold & edgy",       preview: ["#18181B", "#F472B6", "#3F3F46"] },
  { id: "golden",   name: "Golden Hour", vibe: "warm & luxurious",  preview: ["#FFFBEB", "#92400E", "#FDE68A"] },
];

// ── State types ────────────────────────────────────────────────────────────────

interface ContentState {
  templateId: TemplateId;
  data: TemplateContent;
  key: number;
}

interface ImageState {
  imageBase64: string;
  mimeType: string;
}

interface Caption {
  style: string;
  label: string;
  text: string;
  hashtags: string[];
}

interface CaptionsState {
  captions: Caption[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Generator() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("makeup-steps");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("rose");
  const [formatId, setFormatId] = useState<SocialFormatId>("portrait");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<ContentState | null>(null);
  const [image, setImage] = useState<ImageState | null>(null);
  const [captions, setCaptions] = useState<CaptionsState | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [regenMenuOpen, setRegenMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const colors = THEMES[colorTheme];
  const format = SOCIAL_FORMATS.find((f) => f.id === formatId)!;
  const downloadScale = format.outputW / DISPLAY_W;

  const handleCopy = useCallback((caption: Caption, index: number) => {
    const full = `${caption.text}\n\n${caption.hashtags.join(" ")}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }, []);

  async function handleGenerate() {
    if (!topic.trim()) { setError("Tulis dulu topiknya ya!"); return; }
    setError("");
    setIsLoading(true);
    setIsImageLoading(true);
    setIsCaptionLoading(true);
    setImage(null);
    setCaptions(null);

    const topicStr = topic.trim();
    const templateId = selectedTemplate;

    // ── Parallel: text + image + captions ─────────────────────────────────────
    const textPromise = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicStr, templateId, format: formatId }),
    }).then((r) => r.json());

    const imagePromise = fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicStr, templateId }),
    }).then((r) => r.json()).catch(() => null);

    const captionPromise = fetch("/api/generate-caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicStr, templateId }),
    }).then((r) => r.json()).catch(() => null);

    // Text arrives first
    try {
      const textJson = await textPromise;
      if (textJson.error) { setError(textJson.error); setIsLoading(false); setIsImageLoading(false); setIsCaptionLoading(false); return; }
      setContent({ templateId, data: textJson.content, key: Date.now() });
    } catch {
      setError("Gagal konek. Coba lagi ya!");
      setIsLoading(false);
      setIsImageLoading(false);
      setIsCaptionLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }

    // Image + captions arrive after (parallel)
    const [imgJson, capJson] = await Promise.allSettled([imagePromise, captionPromise]);

    if (imgJson.status === "fulfilled" && imgJson.value?.imageBase64) {
      setImage({ imageBase64: imgJson.value.imageBase64, mimeType: imgJson.value.mimeType ?? "image/jpeg" });
    }
    setIsImageLoading(false);

    if (capJson.status === "fulfilled" && capJson.value?.captions) {
      setCaptions(capJson.value as CaptionsState);
    }
    setIsCaptionLoading(false);
  }

  async function handleRegenerateImage() {
    if (!topic.trim() || !content) return;
    setIsImageLoading(true);
    setImage(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), templateId: content.templateId }),
      }).then((r) => r.json());
      if (res?.imageBase64) {
        setImage({ imageBase64: res.imageBase64, mimeType: res.mimeType ?? "image/jpeg" });
      }
    } finally {
      setIsImageLoading(false);
    }
  }

  async function handleRegenerateContent() {
    if (!topic.trim()) return;
    setIsLoading(true);
    setIsCaptionLoading(true);
    setCaptions(null);
    const topicStr = topic.trim();
    const templateId = selectedTemplate;

    const textPromise = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicStr, templateId, format: formatId }),
    }).then((r) => r.json());

    const captionPromise = fetch("/api/generate-caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicStr, templateId }),
    }).then((r) => r.json()).catch(() => null);

    try {
      const textJson = await textPromise;
      if (!textJson.error) {
        setContent({ templateId, data: textJson.content, key: Date.now() });
      }
    } finally {
      setIsLoading(false);
    }

    const capJson = await captionPromise;
    if (capJson?.captions) setCaptions(capJson as CaptionsState);
    setIsCaptionLoading(false);
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: downloadScale,
        useCORS: true,
        backgroundColor: colors.bg,
        width: DISPLAY_W,
        height: format.displayH,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `beautyid-${selectedTemplate}-${format.id}-${Date.now()}.png`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  }

  function renderTemplate() {
    if (!content) return null;
    const { data, key } = content;
    const p = { colors, format: formatId, hasImage: isImageLoading || !!image };
    switch (content.templateId) {
      case "makeup-steps":         return <MakeupSteps         key={key} content={data as never} {...p} />;
      case "daily-routine":        return <DailyRoutine        key={key} content={data as never} {...p} />;
      case "skin-tone-guide":      return <SkinToneGuide       key={key} content={data as never} {...p} />;
      case "acne-guide":           return <AcneGuide           key={key} content={data as never} {...p} />;
      case "makeup-tutorial":      return <MakeupTutorial      key={key} content={data as never} {...p} />;
      case "lip-products":         return <LipProducts         key={key} content={data as never} {...p} />;
      case "skincare-ingredients": return <SkincareIngredients key={key} content={data as never} {...p} />;
      case "clean-makeup":         return <CleanMakeup         key={key} content={data as never} {...p} />;
      case "makeup-checklist":     return <MakeupChecklist     key={key} content={data as never} {...p} />;
      case "no-makeup-look":       return <NoMakeupLook        key={key} content={data as never} {...p} />;
      case "product-comparison":   return <ProductComparison   key={key} content={data as never} {...p} />;
      case "beauty-annotated":     return <BeautyAnnotated     key={key} content={data as never} {...p} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: "#F5F0EE" }}>

      {/* ── Sidebar ───────────────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto lg:h-screen lg:sticky lg:top-0"
        style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #EDE8E5" }}>

        {/* Brand header */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #EDE8E5" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg, #F43F5E 0%, #C2185B 100%)" }}>
              B
            </div>
            <div>
              <h1 className="text-[15px] font-black text-stone-900 leading-none tracking-tight">beauty<span style={{ color: "#F43F5E" }}>ID</span></h1>
              <p className="text-[10px] text-stone-400 font-medium mt-0.5">Buat konten beauty dalam detik</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-5">

          {/* Topic input */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Topik Konten</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Contoh: glass skin, kulit berminyak, igari makeup..."
              rows={3}
              className="w-full rounded-xl border px-3 py-2.5 text-[13px] text-stone-800 resize-none focus:outline-none focus:ring-2 placeholder-stone-300"
              style={{ borderColor: "#E5DDD8" }}
            />
            {/* Quick topic chips */}
            <div className="flex flex-wrap gap-1 mt-2">
              {QUICK_TOPICS.map((t) => (
                <button key={t} onClick={() => setTopic(t)}
                  className="text-[10px] font-medium rounded-full px-2.5 py-0.5 transition-all hover:opacity-80 active:scale-95"
                  style={{ backgroundColor: "#FFF0F3", color: "#C2185B", border: "1px solid #F8BBD9" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Format Kartu</label>
            <div className="grid grid-cols-3 gap-1.5">
              {SOCIAL_FORMATS.map((f) => (
                <button key={f.id} onClick={() => setFormatId(f.id)}
                  className={`rounded-xl py-2.5 px-1 border-2 transition-all text-center ${
                    formatId === f.id
                      ? "border-rose-400 bg-rose-50"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50"
                  }`}>
                  <div className="flex justify-center mb-1">
                    {f.id === "square"   && <div className="w-4 h-4 rounded-sm bg-current opacity-40" style={{ color: formatId === f.id ? "#F43F5E" : "#78716C" }} />}
                    {f.id === "portrait" && <div className="w-3 h-4 rounded-sm bg-current opacity-40" style={{ color: formatId === f.id ? "#F43F5E" : "#78716C" }} />}
                    {f.id === "story"    && <div className="w-2.5 h-4 rounded-sm bg-current opacity-40" style={{ color: formatId === f.id ? "#F43F5E" : "#78716C" }} />}
                  </div>
                  <p className={`text-[10px] font-bold leading-tight ${formatId === f.id ? "text-rose-600" : "text-stone-600"}`}>{f.name}</p>
                  <p className="text-[9px] text-stone-400 font-medium mt-0.5">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Tema Warna</label>
            <div className="grid grid-cols-2 gap-1.5">
              {COLOR_THEMES.map((theme) => (
                <button key={theme.id} onClick={() => setColorTheme(theme.id)}
                  className={`rounded-xl p-2.5 border-2 transition-all text-left ${
                    colorTheme === theme.id ? "border-rose-400 bg-rose-50" : "border-stone-200 hover:border-stone-300"
                  }`}>
                  <div className="flex gap-0.5 mb-1.5">
                    {theme.preview.map((c, i) => (
                      <div key={i} style={{ backgroundColor: c }} className="w-4 h-4 rounded-full border border-black/5" />
                    ))}
                  </div>
                  <p className={`text-[11px] font-bold leading-none ${colorTheme === theme.id ? "text-rose-700" : "text-stone-700"}`}>{theme.name}</p>
                  <p className="text-[9px] text-stone-400 mt-0.5">{theme.vibe}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Template grid */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Jenis Template</label>
            <div className="grid grid-cols-2 gap-1.5">
              {TEMPLATES.map((tmpl) => (
                <button key={tmpl.id} onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`text-left rounded-xl px-2.5 py-2 transition-all border-2 ${
                    selectedTemplate === tmpl.id
                      ? "bg-rose-50 border-rose-400"
                      : "bg-stone-50 border-transparent hover:bg-stone-100"
                  }`}>
                  <span className="text-base">{tmpl.icon}</span>
                  <p className={`text-[11px] font-bold leading-tight mt-0.5 ${selectedTemplate === tmpl.id ? "text-rose-700" : "text-stone-800"}`}>
                    {tmpl.name}
                  </p>
                  <p className="text-[9px] text-stone-400 leading-tight">{tmpl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: "#FFF1F2", border: "1px solid #FECDD3" }}>
              <p className="text-rose-600 text-[12px] font-medium">{error}</p>
            </div>
          )}

          {/* Generate button */}
          <button onClick={handleGenerate} disabled={isLoading}
            className={`w-full rounded-2xl py-3.5 text-[14px] font-black tracking-wide transition-all ${
              isLoading
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "text-white shadow-lg active:scale-95"
            }`}
            style={!isLoading ? { background: "linear-gradient(135deg, #F43F5E 0%, #C2185B 100%)", boxShadow: "0 4px 15px rgba(244,63,94,0.35)" } : {}}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                Lagi bikin konten...
              </span>
            ) : (
              "Bikin Konten"
            )}
          </button>

          <p className="text-[10px] text-stone-400 text-center">
            Tekan <kbd className="px-1 py-0.5 rounded bg-stone-100 text-stone-600 font-mono text-[10px]">⌘</kbd>+<kbd className="px-1 py-0.5 rounded bg-stone-100 text-stone-600 font-mono text-[10px]">Enter</kbd> untuk generate cepat
          </p>
        </div>
      </aside>

      {/* ── Preview area ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 lg:p-10 gap-5">

        {/* Action bar */}
        {content && (
          <div className="flex items-center gap-2" style={{ width: DISPLAY_W }}>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-stone-500">
                {format.name} · {format.outputW}×{format.outputH}
              </p>
              {isImageLoading && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                  <span className="w-2.5 h-2.5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin inline-block" />
                  Menambahkan gambar...
                </p>
              )}
            </div>
            {/* Regenerate dropdown */}
            <div className="relative">
              <button
                onClick={() => setRegenMenuOpen((v) => !v)}
                disabled={isLoading || isImageLoading}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold transition-all border-2 ${
                  isLoading || isImageLoading
                    ? "border-stone-200 text-stone-300 cursor-not-allowed"
                    : "border-rose-200 text-rose-500 hover:bg-rose-50 active:scale-95"
                }`}>
                {(isLoading || isImageLoading) ? (
                  <span className="w-3 h-3 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                )}
                Regenerate
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {regenMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setRegenMenuOpen(false)} />
                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-1.5 z-20 rounded-2xl overflow-hidden"
                    style={{ backgroundColor: "#fff", border: "1px solid #EDE8E5", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 190 }}>
                    <div className="px-3 pt-2.5 pb-1">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Pilih yang mau di-regenerate</p>
                    </div>
                    {[
                      {
                        label: "Semua",
                        sub: "Konten + Gambar + Caption",
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M8 16H3v5"/>
                          </svg>
                        ),
                        action: () => { setRegenMenuOpen(false); handleGenerate(); },
                      },
                      {
                        label: "Gambar saja",
                        sub: "Generate ulang foto AI",
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        ),
                        action: () => { setRegenMenuOpen(false); handleRegenerateImage(); },
                      },
                      {
                        label: "Konten saja",
                        sub: "Teks + Caption, gambar tetap",
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        ),
                        action: () => { setRegenMenuOpen(false); handleRegenerateContent(); },
                      },
                    ].map((item) => (
                      <button key={item.label} onClick={item.action}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-rose-50 transition-colors text-left">
                        <span style={{ color: "#C2185B" }}>{item.icon}</span>
                        <div>
                          <p className="text-[12px] font-bold text-stone-800 leading-none">{item.label}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">{item.sub}</p>
                        </div>
                      </button>
                    ))}
                    <div className="h-2" />
                  </div>
                </>
              )}
            </div>
            <button onClick={handleDownload} disabled={isDownloading}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold transition-all ${
                isDownloading ? "bg-stone-200 text-stone-400 cursor-not-allowed" : "bg-stone-900 hover:bg-stone-700 text-white active:scale-95"
              }`}>
              {isDownloading ? (
                <><span className="w-3 h-3 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />Menyimpan...</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PNG</>
              )}
            </button>
          </div>
        )}

        {/* Card */}
        <div ref={cardRef}
          style={{
            width: DISPLAY_W,
            height: content ? format.displayH : "auto",
            minHeight: content ? undefined : 320,
            overflow: "hidden",
            backgroundColor: colors.bg,
            flexShrink: 0,
          }}
          className="rounded-2xl shadow-2xl">

          {content ? (
            <div className="w-full h-full flex flex-col">
              {/* ── Image strip ─────────────────────────────────────────────── */}
              {image ? (
                <div style={{ height: format.imgH, flexShrink: 0 }} className="relative overflow-hidden">
                  <img
                    src={`data:${image.mimeType};base64,${image.imageBase64}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div
                    style={{ background: `linear-gradient(to bottom, transparent 50%, ${colors.bg} 100%)` }}
                    className="absolute inset-0"
                  />
                </div>
              ) : isImageLoading ? (
                <div style={{ height: format.imgH, backgroundColor: colors.accent, flexShrink: 0 }}
                  className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
                  <p style={{ color: colors.textLight, fontSize: "0.65rem" }} className="font-medium">Bikin gambar AI...</p>
                </div>
              ) : null}

              {/* ── Template content ─────────────────────────────────────────── */}
              <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                {renderTemplate()}
              </div>
            </div>
          ) : (
            /* ── Empty state ────────────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center h-80 text-center p-8">
              {isLoading ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin mb-4" />
                  <p className="text-stone-700 font-bold text-base">Lagi bikin konten...</p>
                  <p className="text-stone-400 text-[12px] mt-1">AI lagi nulis + bikin gambar sekaligus</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                    style={{ background: "linear-gradient(135deg, #FFF0F3 0%, #FCE4EC 100%)", border: "1px solid #F8BBD9" }}>
                    ✨
                  </div>
                  <p className="text-stone-800 font-black text-base">Siap bikin konten?</p>
                  <p className="text-stone-400 text-[13px] mt-1.5 max-w-[240px] leading-relaxed">
                    Pilih template, tulis topik, tekan <strong className="text-stone-600">Bikin Konten</strong>
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#FFF0F3", color: "#C2185B" }}>
                      Text + Gambar AI
                    </div>
                    <div className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#F0F9FF", color: "#0369A1" }}>
                      Bisa diedit
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {content && (
          <p className="text-[11px] text-stone-400">
            Klik teks di kartu untuk edit langsung sebelum download
          </p>
        )}

        {/* ── Captions section ────────────────────────────────────────────────── */}
        {(captions || isCaptionLoading) && content && (
          <div style={{ width: DISPLAY_W }} className="pb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5DDD8" }} />
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest px-2">5 Caption Siap Pakai</p>
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5DDD8" }} />
            </div>

            {isCaptionLoading && !captions && (
              <div className="flex items-center justify-center gap-2 py-8">
                <div className="w-4 h-4 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
                <p className="text-stone-400 text-[12px]">Nulis caption...</p>
              </div>
            )}

            {captions && (
              <div className="space-y-2.5">
                {captions.captions.map((cap, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE8E5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    {/* Label bar */}
                    <div className="flex items-center justify-between px-3 py-2"
                      style={{ borderBottom: "1px solid #F5F0EE" }}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#C2185B" }}>
                        {cap.label}
                      </span>
                      <button
                        onClick={() => handleCopy(cap, i)}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95"
                        style={copiedIndex === i
                          ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                          : { backgroundColor: "#FFF0F3", color: "#C2185B" }
                        }>
                        {copiedIndex === i ? (
                          <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tersalin!</>
                        ) : (
                          <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                        )}
                      </button>
                    </div>
                    {/* Caption body */}
                    <div className="px-3 pt-2.5 pb-1.5">
                      <p className="text-[12px] text-stone-800 leading-relaxed font-medium">{cap.text}</p>
                    </div>
                    {/* Hashtags */}
                    <div className="px-3 pb-3 flex flex-wrap gap-1 mt-1">
                      {cap.hashtags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                          style={{ backgroundColor: "#F5F0EE", color: "#78716C" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
