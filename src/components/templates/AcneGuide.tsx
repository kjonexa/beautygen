"use client";

import type { AcneGuideContent, ThemeColors } from "@/types";
import { Dots, Sparkle } from "@/components/Decorations";

interface Props { content: AcneGuideContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function AcneGuide({ content, colors, format, hasImage }: Props) {
  const maxItems = (format === "square" || hasImage) ? 2 : 3;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      <div className="absolute top-2 right-2 pointer-events-none">
        <Dots size={28} color={colors.primary} opacity={0.12} />
      </div>

      <div className="text-center mb-2 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.1rem", lineHeight: 1.2, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        <div className="flex justify-center gap-1 mt-1">
          {[0,1,2].map(i => <Sparkle key={i} size={i===1?10:7} color={colors.primary} opacity={0.3} />)}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-hidden">
        {content.types.slice(0, 4).map((type, i) => (
          <div key={i} style={{ backgroundColor: colors.card, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} className="rounded-xl overflow-hidden flex flex-col">
            <div style={{ backgroundColor: type.color }} className="px-2 py-1.5 text-center flex-shrink-0">
              <p contentEditable suppressContentEditableWarning style={{ color: "#1A1A1A", fontSize: "0.7rem" }} className="font-black outline-none cursor-text">
                {type.name}
              </p>
            </div>
            <div className="p-2 flex-1 flex flex-col gap-1 overflow-hidden">
              <div>
                <p style={{ color: colors.secondary, fontSize: "0.54rem" }} className="font-black uppercase tracking-wide mb-0.5">Ciri</p>
                {type.ciri.slice(0, maxItems).map((c, j) => (
                  <div key={j} className="flex items-start gap-0.5 mb-0.5">
                    <span style={{ color: type.color, lineHeight: 1 }} className="text-xs flex-shrink-0">◦</span>
                    <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.6rem" }} className="leading-snug outline-none cursor-text">
                      {c}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${colors.border}` }} className="pt-1">
                <p style={{ color: colors.secondary, fontSize: "0.54rem" }} className="font-black uppercase tracking-wide mb-0.5">Cara Atasi</p>
                {type.caraAtasi.slice(0, maxItems).map((c, j) => (
                  <div key={j} className="flex items-start gap-0.5 mb-0.5">
                    <span style={{ color: colors.primary, fontSize: "0.6rem" }} className="flex-shrink-0 mt-0.5">→</span>
                    <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.6rem" }} className="leading-snug outline-none cursor-text">
                      {c}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
