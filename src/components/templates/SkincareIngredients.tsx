"use client";

import type { SkincareIngredientsContent, ThemeColors } from "@/types";
import { Leaf, Molecule } from "@/components/Decorations";

interface Props { content: SkincareIngredientsContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function SkincareIngredients({ content, colors, format, hasImage }: Props) {
  const maxConcerns = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 6 : format === "portrait" ? 5 : 4);
  const maxIngr = format === "square" ? 3 : 4;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Decorations */}
      <div className="absolute top-2 right-2 pointer-events-none">
        <Molecule size={34} color={colors.primary} opacity={0.18} />
      </div>
      <div className="absolute bottom-3 left-2 pointer-events-none">
        <Leaf size={26} color={colors.primary} opacity={0.35} />
      </div>

      <div className="mb-2 flex-shrink-0 pr-8">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.05rem", lineHeight: 1.2, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        <div style={{ backgroundColor: colors.primary }} className="h-0.5 w-10 mt-1 opacity-30 rounded-full" />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-hidden">
        {content.concerns.slice(0, maxConcerns).map((concern, i) => (
          <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            className="rounded-xl p-2 border overflow-hidden flex flex-col">
            <p contentEditable suppressContentEditableWarning
              style={{ color: colors.primary, fontSize: "0.65rem", borderBottom: `1.5px solid ${colors.accent}` }}
              className="font-black pb-1 mb-1 outline-none cursor-text leading-tight">
              {concern.name}
            </p>
            <div className="flex-1 space-y-0.5 overflow-hidden">
              {concern.ingredients.slice(0, maxIngr).map((ing, j) => (
                <div key={j} className="flex items-start gap-1">
                  <div style={{ backgroundColor: colors.secondary, minWidth: 4, height: 4 }} className="rounded-full flex-shrink-0 mt-1" />
                  <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.6rem" }} className="leading-snug outline-none cursor-text">
                    {ing}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: colors.textLight, fontSize: "0.52rem" }} className="mt-1.5 text-center italic flex-shrink-0">
        Konsultasikan dengan dermatologis untuk kulit sensitif
      </p>
    </div>
  );
}
