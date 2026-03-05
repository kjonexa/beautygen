"use client";

import type { MakeupChecklistContent, ThemeColors } from "@/types";
import { Sparkle, SparkleSmall, Dots } from "@/components/Decorations";

interface Props { content: MakeupChecklistContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function MakeupChecklist({ content, colors, format, hasImage }: Props) {
  const maxCats = hasImage ? (format === "story" ? 4 : format === "portrait" ? 3 : 2) : (format === "story" ? 5 : format === "portrait" ? 4 : 3);
  const maxItems = format === "square" ? 2 : 3;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      <div className="absolute top-1 right-1 pointer-events-none">
        <Dots size={26} color={colors.primary} opacity={0.12} />
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <Sparkle size={14} color={colors.primary} opacity={0.15} />
      </div>

      <div className="text-center mb-2 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.1rem", lineHeight: 1.15, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {content.subtitle && (
          <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.62rem" }} className="mt-0.5 outline-none cursor-text">
            {content.subtitle}
          </p>
        )}
        <div className="flex justify-center gap-1 mt-1">
          {[0,1,2].map(i => <SparkleSmall key={i} size={i===1?9:6} color={colors.primary} opacity={0.3} />)}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {content.categories.slice(0, maxCats).map((cat, i) => (
          <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            className="rounded-xl overflow-hidden border flex-shrink-0">
            <div style={{ backgroundColor: colors.primary }} className="px-3 py-1.5">
              <p contentEditable suppressContentEditableWarning style={{ color: "#fff", fontSize: "0.62rem" }} className="font-black uppercase tracking-widest outline-none cursor-text">
                {cat.name}
              </p>
            </div>
            <div className="px-2.5 py-1.5 space-y-1">
              {cat.items.slice(0, maxItems).map((item, j) => (
                <div key={j} className="flex items-start gap-1.5">
                  <div style={{ borderColor: colors.primary, borderWidth: 1.5, minWidth: 12, height: 12 }} className="rounded mt-0.5 flex-shrink-0" />
                  <div>
                    <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.68rem" }} className="font-semibold leading-tight outline-none cursor-text">
                      {item.text}
                    </p>
                    {item.detail && (
                      <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.58rem" }} className="leading-tight outline-none cursor-text">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
