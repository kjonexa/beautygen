"use client";

import type { DailyRoutineContent, ThemeColors } from "@/types";
import { Blossom, Dots } from "@/components/Decorations";

interface Props { content: DailyRoutineContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function DailyRoutine({ content, colors, format, hasImage }: Props) {
  const maxSteps = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 6 : format === "portrait" ? 5 : 4);
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Decorations */}
      <div className="absolute top-2 right-2 pointer-events-none">
        <Blossom size={36} color={colors.accent} opacity={0.8} />
      </div>
      <div className="absolute bottom-3 right-2 pointer-events-none">
        <Dots size={24} color={colors.primary} opacity={0.15} />
      </div>

      {/* Header */}
      <div className="text-center mb-2 flex-shrink-0">
        <div style={{ color: colors.secondary, fontSize: "0.58rem" }} className="font-bold tracking-[0.18em] uppercase mb-0.5">Daily Routine</div>
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.2rem", lineHeight: 1.1 }} className="font-black outline-none cursor-text">
          {content.title}
        </h1>
        {content.subtitle && (
          <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.62rem" }} className="mt-0.5 outline-none cursor-text">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {content.steps.slice(0, maxSteps).map((step) => (
          <div key={step.number}
            style={{ backgroundColor: colors.card, borderLeft: `3px solid ${colors.primary}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            className="rounded-r-xl p-2 flex items-start gap-2 flex-shrink-0">
            <div style={{ backgroundColor: colors.badge, color: colors.primary, minWidth: 24, height: 24, fontSize: "0.72rem" }}
              className="rounded-full flex items-center justify-center font-black flex-shrink-0">
              {step.number}
            </div>
            <div className="flex-1 min-w-0">
              <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.73rem" }} className="font-bold leading-tight outline-none cursor-text">
                {step.name}
              </p>
              {step.products && (
                <p contentEditable suppressContentEditableWarning style={{ color: colors.secondary, fontSize: "0.62rem" }} className="mt-0.5 font-medium leading-tight outline-none cursor-text">
                  {step.products}
                </p>
              )}
              {step.tip && (
                <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.58rem" }} className="mt-0.5 italic outline-none cursor-text">
                  {step.tip}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {content.finalTip && (
        <div style={{ backgroundColor: colors.accent, borderColor: colors.border }} className="mt-1.5 rounded-xl p-2 border text-center flex-shrink-0">
          <p contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "0.63rem" }} className="font-semibold outline-none cursor-text">
            {content.finalTip}
          </p>
        </div>
      )}
    </div>
  );
}
