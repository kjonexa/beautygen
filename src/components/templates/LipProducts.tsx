"use client";

import type { LipProductsContent, ThemeColors } from "@/types";
import { Heart, Floral, SparkleSmall } from "@/components/Decorations";

interface Props { content: LipProductsContent; colors: ThemeColors; format: string; hasImage?: boolean; }

const ICONS = ["💄", "💋", "✨", "🌸", "💅", "🎀"];

export default function LipProducts({ content, colors, format, hasImage }: Props) {
  const maxProducts = hasImage ? (format === "story" ? 4 : format === "portrait" ? 3 : 2) : (format === "story" ? 5 : format === "portrait" ? 4 : 3);
  const maxKarakter = 3;
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Decoration */}
      <div className="absolute top-1 right-1 pointer-events-none">
        <Floral size={34} color={colors.accent} opacity={0.9} />
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none">
        <Heart size={16} color={colors.primary} opacity={0.2} />
      </div>

      <div className="text-center mb-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <SparkleSmall size={8} color={colors.primary} opacity={0.4} />
          <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.15rem", lineHeight: 1.1, fontFamily: "Georgia, serif" }}
            className="font-black outline-none cursor-text">
            {content.title}
          </h1>
          <SparkleSmall size={8} color={colors.primary} opacity={0.4} />
        </div>
        <div style={{ backgroundColor: colors.primary }} className="h-px w-12 mx-auto opacity-25 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {content.products.slice(0, maxProducts).map((product, i) => (
          <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            className="rounded-xl p-2 border flex items-start gap-2 flex-shrink-0">
            <span className="text-lg flex-shrink-0 leading-none mt-0.5">{ICONS[i % ICONS.length]}</span>
            <div className="flex-1 min-w-0">
              <p contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "0.75rem" }} className="font-black leading-tight outline-none cursor-text">
                {product.name}
              </p>
              <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.6rem" }} className="mt-0.5 leading-tight outline-none cursor-text">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.karakteristik.slice(0, maxKarakter).map((k, j) => (
                  <span key={j} contentEditable suppressContentEditableWarning
                    style={{ backgroundColor: colors.badge, color: colors.badgeText, fontSize: "0.55rem" }}
                    className="px-1.5 py-0.5 rounded-full font-semibold outline-none cursor-text">
                    {k}
                  </span>
                ))}
              </div>
              <p contentEditable suppressContentEditableWarning style={{ color: colors.secondary, fontSize: "0.62rem" }} className="mt-1 font-bold outline-none cursor-text">
                Best for: {product.bestFor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
