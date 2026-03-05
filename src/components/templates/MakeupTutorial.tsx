"use client";

import type { MakeupTutorialContent, ThemeColors } from "@/types";
import { Sparkle, SparkleSmall, Arc } from "@/components/Decorations";

interface Props { content: MakeupTutorialContent; colors: ThemeColors; format: string; hasImage?: boolean; }

export default function MakeupTutorial({ content, colors, format, hasImage }: Props) {
  const maxSteps = hasImage ? (format === "story" ? 5 : format === "portrait" ? 4 : 3) : (format === "story" ? 7 : format === "portrait" ? 5 : 4);
  return (
    <div style={{ backgroundColor: colors.bg }} className="w-full h-full flex flex-col overflow-hidden p-3 relative">
      {/* Decorations */}
      <div className="absolute top-1.5 right-2 pointer-events-none flex gap-1">
        <SparkleSmall size={8} color={colors.primary} opacity={0.3} />
        <Sparkle size={14} color={colors.primary} opacity={0.25} />
        <SparkleSmall size={6} color={colors.primary} opacity={0.3} />
      </div>

      {/* Header */}
      <div style={{ borderBottom: `2px solid ${colors.primary}` }} className="pb-2 mb-2 flex-shrink-0">
        <h1 contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "1.2rem", lineHeight: 1.1, fontFamily: "Georgia, serif" }}
          className="font-black outline-none cursor-text pr-10">
          {content.title}
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div style={{ backgroundColor: colors.secondary, width: 6, height: 6, borderRadius: "50%" }} />
          <p contentEditable suppressContentEditableWarning style={{ color: colors.secondary, fontSize: "0.68rem" }} className="font-bold outline-none cursor-text">
            {content.lookName}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {content.steps.slice(0, maxSteps).map((step) => (
          <div key={step.number} className="flex items-start gap-2 flex-shrink-0">
            <div style={{ backgroundColor: colors.primary, color: "#fff", minWidth: 22, height: 22, fontSize: "0.65rem" }}
              className="rounded-full flex items-center justify-center font-black flex-shrink-0">
              {step.number}
            </div>
            <div className="flex-1 overflow-hidden">
              <p contentEditable suppressContentEditableWarning style={{ color: colors.text, fontSize: "0.73rem" }} className="font-bold leading-tight outline-none cursor-text">
                {step.name}
              </p>
              <p contentEditable suppressContentEditableWarning style={{ color: colors.textLight, fontSize: "0.62rem" }} className="mt-0.5 leading-snug outline-none cursor-text">
                {step.detail}
              </p>
              {step.tip && (
                <span contentEditable suppressContentEditableWarning
                  style={{ color: colors.secondary, fontSize: "0.58rem", backgroundColor: colors.badge }}
                  className="mt-0.5 px-1.5 py-0.5 rounded-full inline-block font-semibold outline-none cursor-text">
                  {step.tip}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {content.note && (
        <div style={{ backgroundColor: colors.accent, borderColor: colors.border }} className="mt-1.5 rounded-xl p-2 border flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5">
            <SparkleSmall size={7} color={colors.primary} opacity={0.5} />
            <p contentEditable suppressContentEditableWarning style={{ color: colors.primary, fontSize: "0.63rem" }} className="font-semibold text-center outline-none cursor-text">
              {content.note}
            </p>
            <SparkleSmall size={7} color={colors.primary} opacity={0.5} />
          </div>
        </div>
      )}

      {/* Bottom arc decoration */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-20">
        <Arc size={50} color={colors.accent} opacity={1} />
      </div>
    </div>
  );
}
