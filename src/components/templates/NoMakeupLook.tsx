"use client";

import type { NoMakeupLookContent, ThemeColors } from "@/types";
import { Floral, Wave } from "@/components/Decorations";

interface Props { content: NoMakeupLookContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function NoMakeupLook({ content, colors, format, hasImage }: Props) {
  const maxSections = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 6 : format === "portrait" ? 5 : 4);
  const maxItems = 3;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <Floral size={38} color={colors.accent} opacity={0.85} />
      </div>

      <div className="mb-2 flex-shrink-0">
        <p style={{ color: colors.secondary, fontSize: "0.57rem" }} className="font-bold tracking-[0.18em] uppercase mb-0.5">The Look</p>
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.15rem", lineHeight: 1.1, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {content.subtitle && (
          <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.62rem" }} className="mt-0.5 outline-none cursor-text">
            {content.subtitle}
          </p>
        )}
        <Wave width={45} color={colors.primary} opacity={0.25} className="mt-1" />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {content.sections.slice(0, maxSections).map((section, i) => (
          <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            className="rounded-xl p-2 border flex items-start gap-1.5 flex-shrink-0">
            <div style={{ backgroundColor: colors.primary, minWidth: 3 }} className="rounded-full self-stretch flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "0.62rem" }} className="font-black uppercase tracking-wide leading-tight outline-none cursor-text">
                {section.name}
              </p>
              {section.tip && (
                <p contentEditable suppressContentEditableWarning style={{ color: colors.secondary, fontSize: "0.6rem" }} className="font-semibold mb-0.5 outline-none cursor-text leading-tight">
                  {section.tip}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-0">
                {section.items.slice(0, maxItems).map((item, j) => (
                  <div key={j} className="flex items-start gap-0.5">
                    <span style={{ color: colors.secondary, fontSize: "0.58rem" }} className="flex-shrink-0 mt-0.5">•</span>
                    <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.6rem" }} className="leading-snug outline-none cursor-text">
                      {item}
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
