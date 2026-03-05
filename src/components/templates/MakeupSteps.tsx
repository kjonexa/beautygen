"use client";

import type { MakeupStepsContent, ThemeColors } from "@/types";
import { SparkleCluster, SparkleSmall, Wave } from "@/components/Decorations";

interface Props { content: MakeupStepsContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function MakeupSteps({ content, colors, format, hasImage }: Props) {
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Corner decoration */}
      <div className="absolute top-1 right-1 pointer-events-none">
        <SparkleCluster size={42} color={colors.primary} opacity={0.22} />
      </div>

      {/* Header */}
      <div className="text-center mb-2 flex-shrink-0 relative">
        <div style={{ color: colors.secondary, fontSize: "0.58rem" }} className="font-bold tracking-[0.18em] uppercase mb-0.5">Beauty Tips</div>
        <h1 contentEditable suppressContentEditableWarning
          style={{ color: colors.primary, fontSize: "1.2rem", lineHeight: 1.1, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {content.subtitle && (
          <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.63rem" }} className="mt-0.5 outline-none cursor-text">
            {content.subtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-1 mt-1">
          <SparkleSmall size={8} color={colors.primary} opacity={0.4} />
          <Wave width={40} color={colors.primary} opacity={0.3} />
          <SparkleSmall size={8} color={colors.primary} opacity={0.4} />
        </div>
      </div>

      {/* Steps grid */}
      <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-hidden">
        {content.steps.slice(0, hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 6 : format === "portrait" ? 5 : 4)).map((step) => (
          <div key={step.number}
            style={{ backgroundColor: colors.card, borderColor: colors.border, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            className="rounded-xl p-2 border flex items-start gap-1.5">
            <div style={{ backgroundColor: colors.primary, color: "#fff", minWidth: 22, height: 22, fontSize: "0.65rem" }}
              className="rounded-full flex items-center justify-center font-black flex-shrink-0">
              {step.number}
            </div>
            <div className="flex-1 min-w-0">
              <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.7rem" }} className="font-bold leading-tight outline-none cursor-text">
                {step.title}
              </p>
              {step.description && (
                <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.6rem" }} className="mt-0.5 leading-snug outline-none cursor-text">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      {content.tip && (
        <div style={{ backgroundColor: colors.badge, borderColor: colors.border }} className="mt-1.5 rounded-xl p-2 border flex-shrink-0 flex items-center justify-center gap-1.5">
          <SparkleSmall size={8} color={colors.badgeText} opacity={0.6} />
          <p contentEditable suppressContentEditableWarning style={{ color: colors.badgeText, fontSize: "0.63rem" }} className="font-semibold outline-none cursor-text">
            {content.tip}
          </p>
          <SparkleSmall size={8} color={colors.badgeText} opacity={0.6} />
        </div>
      )}
    </div>
  );
}
