"use client";

import type { ProductComparisonContent, ThemeColors } from "@/types";
import { Diamond, SparkleSmall } from "@/components/Decorations";

interface Props { content: ProductComparisonContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function ProductComparison({ content, colors, format, hasImage }: Props) {
  const maxFeatures = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 4) : (format === "story" ? 7 : format === "portrait" ? 6 : 5);
  const cols = Math.min(content.products.length, 3);
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      <div className="absolute top-2 right-2 pointer-events-none flex gap-1">
        <Diamond size={10} color={colors.primary} opacity={0.25} />
        <Diamond size={14} color={colors.primary} opacity={0.2} />
        <Diamond size={10} color={colors.primary} opacity={0.25} />
      </div>

      <div className="text-center mb-2 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.1rem", lineHeight: 1.15, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        <div className="flex justify-center gap-1 mt-0.5">
          {[0,1,2].map(i=><SparkleSmall key={i} size={i===1?8:5} color={colors.primary} opacity={0.3} />)}
        </div>
      </div>

      <div style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
        className="flex-1 rounded-xl overflow-hidden border flex flex-col">
        {/* Product headers */}
        <div className="grid flex-shrink-0" style={{ gridTemplateColumns: `1fr repeat(${cols}, 1fr)` }}>
          <div style={{ backgroundColor: colors.primary }} className="p-2" />
          {content.products.slice(0, cols).map((product, i) => (
            <div key={i} style={{ backgroundColor: colors.primary }} className="p-2 text-center border-l border-white border-opacity-20">
              <p contentEditable suppressContentEditableWarning style={{ color: "#fff", fontSize: "0.63rem" }} className="font-black outline-none cursor-text leading-tight">
                {product}
              </p>
            </div>
          ))}
        </div>

        {/* Feature rows */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {content.features.slice(0, maxFeatures).map((feature, i) => (
            <div key={i} className="grid flex-1" style={{ gridTemplateColumns: `1fr repeat(${cols}, 1fr)`, backgroundColor: i % 2 === 0 ? colors.badge : colors.card, minHeight: 0 }}>
              <div style={{ borderColor: colors.border }} className="px-2 py-1.5 border-b flex items-center">
                <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.62rem" }} className="font-bold outline-none cursor-text leading-tight">
                  {feature.name}
                </p>
              </div>
              {feature.values.slice(0, cols).map((val, j) => (
                <div key={j} style={{ borderColor: colors.border }} className="px-1.5 py-1.5 text-center border-l border-b flex items-center justify-center">
                  <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.58rem" }} className="outline-none cursor-text leading-tight">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
