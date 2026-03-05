"use client";

import type { SkinToneContent, ThemeColors } from "@/types";
import { Wave, SparkleSmall } from "@/components/Decorations";

interface Props { content: SkinToneContent; colors: ThemeColors; format: string; hasImage?: boolean; }

const SWATCHES = [
  { bg: "#FDEBD0", text: "#7B4F2E", border: "#F0C490" },
  { bg: "#E8B48C", text: "#5C2E0E", border: "#D4935A" },
  { bg: "#A0724A", text: "#FFFFFF", border: "#7A5230" },
  { bg: "#6B3A1F", text: "#FFFFFF", border: "#4A2410" },
];

export default function SkinToneGuide({ content, colors, format, hasImage }: Props) {
  const maxRecs = (format === "square" || hasImage) ? 2 : 3;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3">
      {/* Header with swatch row */}
      <div className="text-center mb-2 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.1rem", lineHeight: 1.15, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {/* Visual skin tone spectrum */}
        <div className="flex items-center justify-center gap-1 mt-1.5 mb-1">
          {SWATCHES.map((sw, i) => (
            <div key={i} style={{ backgroundColor: sw.bg, borderColor: sw.border }} className="w-5 h-5 rounded-full border-2" />
          ))}
          <SparkleSmall size={8} color={colors.primary} opacity={0.4} />
        </div>
        <Wave width={50} color={colors.primary} opacity={0.25} className="mx-auto" />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-hidden">
        {content.tones.slice(0, 4).map((tone, i) => {
          const sw = SWATCHES[i % SWATCHES.length];
          return (
            <div key={tone.name} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              className="rounded-xl overflow-hidden border flex flex-col">
              <div style={{ backgroundColor: sw.bg, borderBottom: `1.5px solid ${sw.border}` }} className="px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <div style={{ backgroundColor: sw.bg, borderColor: sw.border, border: `2px solid ${sw.border}`, opacity: 0.8 }} className="w-3.5 h-3.5 rounded-full flex-shrink-0" />
                  <p contentEditable suppressContentEditableWarning style={{ color: sw.text, fontSize: "0.65rem" }} className="font-black outline-none cursor-text">
                    {tone.name}
                  </p>
                </div>
                <p contentEditable suppressContentEditableWarning style={{ color: sw.text, fontSize: "0.55rem", opacity: 0.75 }} className="mt-0.5 outline-none cursor-text">
                  {tone.foundationShade}
                </p>
              </div>
              <div className="p-2 flex-1 overflow-hidden">
                <p style={{ color: colors.secondary, fontSize: "0.52rem" }} className="font-bold uppercase tracking-wide mb-0.5">Rekomendasi</p>
                {tone.recommendations.slice(0, maxRecs).map((rec, j) => (
                  <div key={j} className="flex items-start gap-0.5 mb-0.5">
                    <span style={{ color: colors.primary, fontSize: "0.6rem" }} className="flex-shrink-0">•</span>
                    <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.6rem" }} className="leading-tight outline-none cursor-text">
                      {rec}
                    </p>
                  </div>
                ))}
                {tone.avoid && (
                  <p contentEditable suppressContentEditableWarning
                    style={{ color: "#B71C1C", fontSize: "0.55rem", backgroundColor: "#FFEBEE", lineHeight: 1.3 }}
                    className="mt-1 px-1.5 py-0.5 rounded outline-none cursor-text">
                    ✗ {tone.avoid}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
