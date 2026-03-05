"use client";

import type { CleanMakeupContent, ThemeColors } from "@/types";
import { Ring, Heart, SparkleSmall } from "@/components/Decorations";

interface Props { content: CleanMakeupContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function CleanMakeup({ content, colors, format, hasImage }: Props) {
  const maxSteps = hasImage ? (format === "story" ? 4 : format === "portrait" ? 3 : 2) : (format === "story" ? 6 : format === "portrait" ? 4 : 3);
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Large faded ring decoration */}
      <div className="absolute -top-4 -right-4 pointer-events-none">
        <Ring size={80} color={colors.primary} opacity={0.1} />
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <Heart size={18} color={colors.primary} opacity={0.18} />
      </div>

      {/* Bold header */}
      <div style={{ borderBottom: `2px solid ${colors.primary}` }} className="pb-2 mb-2.5 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning
          style={{ color: colors.primary, fontSize: format === "square" ? "1.7rem" : "2rem", lineHeight: 0.95 }}
          className="font-black uppercase tracking-tighter outline-none cursor-text">
          {content.title}
        </h1>
        <p contentEditable suppressContentEditableWarning style={{ color: colors.secondary, fontSize: "0.72rem" }} className="font-bold mt-1 uppercase tracking-wide outline-none cursor-text">
          {content.subtitle}
        </p>
      </div>

      {/* Key points */}
      <div className="space-y-1.5 mb-2.5 flex-shrink-0">
        {content.keyPoints.slice(0, 4).map((point, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ backgroundColor: colors.primary }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
            <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.82rem" }} className="font-bold leading-tight outline-none cursor-text">
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Steps */}
      {content.steps && (
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          {content.steps.slice(0, maxSteps).map((step, i) => (
            <div key={i} style={{ backgroundColor: colors.card, borderColor: colors.border }} className="rounded-lg px-2.5 py-1.5 border flex items-center gap-2 flex-shrink-0">
              <div style={{ backgroundColor: colors.primary, color: "#fff", minWidth: 18, height: 18, fontSize: "0.58rem" }}
                className="rounded-full flex items-center justify-center font-black flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 overflow-hidden">
                <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.72rem" }} className="font-bold leading-tight outline-none cursor-text">
                  {step.name}
                </p>
                {step.tip && (
                  <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.6rem" }} className="outline-none cursor-text leading-tight">
                    {step.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {content.tagline && (
        <div className="mt-2 flex items-center justify-center gap-1.5 flex-shrink-0">
          <SparkleSmall size={7} color={colors.textLight} opacity={0.5} />
          <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.62rem" }} className="text-center italic font-medium outline-none cursor-text">
            {content.tagline}
          </p>
          <SparkleSmall size={7} color={colors.textLight} opacity={0.5} />
        </div>
      )}
    </div>
  );
}
