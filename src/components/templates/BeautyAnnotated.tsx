"use client";

import type { BeautyAnnotatedContent, ThemeColors } from "@/types";
import { Sparkle, SparkleSmall, Blossom } from "@/components/Decorations";

interface Props { content: BeautyAnnotatedContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function BeautyAnnotated({ content, colors, format, hasImage }: Props) {
  const maxAreas = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 6 : format === "portrait" ? 6 : 4);
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      <div className="absolute bottom-2 left-2 pointer-events-none">
        <Blossom size={34} color={colors.accent} opacity={0.75} />
      </div>

      {/* Gradient header */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        className="rounded-2xl p-3 text-center mb-2 flex-shrink-0 relative overflow-hidden">
        {/* Decoration inside header */}
        <div className="absolute top-1 right-1 pointer-events-none flex gap-0.5">
          <SparkleSmall size={8} color="rgba(255,255,255,0.5)" opacity={1} />
          <Sparkle size={13} color="rgba(255,255,255,0.4)" opacity={1} />
          <SparkleSmall size={6} color="rgba(255,255,255,0.5)" opacity={1} />
        </div>
        <h1 contentEditable suppressContentEditableWarning style={{ color: "#fff", fontSize: "1.6rem", lineHeight: 1 }} className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {content.subtitle && (
          <p contentEditable suppressContentEditableWarning style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65rem" }} className="mt-0.5 font-medium outline-none cursor-text">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Annotation areas */}
      <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-hidden">
        {content.areas.slice(0, maxAreas).map((area, i) => (
          <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            className="rounded-xl p-2 border overflow-hidden">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-base flex-shrink-0 leading-none">{area.icon ?? "✦"}</span>
              <p contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "0.6rem" }} className="font-black uppercase tracking-wide leading-tight outline-none cursor-text">
                {area.zone}
              </p>
            </div>
            <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.7rem" }} className="font-semibold leading-tight outline-none cursor-text">
              {area.product}
            </p>
            <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.6rem" }} className="mt-0.5 leading-snug outline-none cursor-text">
              {area.tip}
            </p>
          </div>
        ))}
      </div>

      {content.finalNote && (
        <div style={{ backgroundColor: colors.badge, borderColor: colors.border }} className="mt-1.5 rounded-xl p-2 border flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5">
            <SparkleSmall size={7} color={colors.badgeText} opacity={0.5} />
            <p contentEditable suppressContentEditableWarning style={{ color: colors.badgeText, fontSize: "0.63rem" }} className="font-semibold text-center outline-none cursor-text">
              {content.finalNote}
            </p>
            <SparkleSmall size={7} color={colors.badgeText} opacity={0.5} />
          </div>
        </div>
      )}
    </div>
  );
}
