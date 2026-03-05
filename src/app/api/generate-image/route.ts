import { NextRequest, NextResponse } from "next/server";
import { generateGeminiImage } from "@/lib/image-gen";
import type { TemplateId } from "@/types";

// ── Image prompt per template ─────────────────────────────────────────────────
// All prompts: no text, no watermarks, aesthetic beauty style, soft colors.

const STYLE_BASE = `
High-quality beauty photography. Soft natural lighting. Warm and fresh tones.
Realistic, editorial style. No text, no watermarks, no numbers, no letters.
`;

const MODEL_BASE = `
Young Southeast Asian or Indonesian woman, natural beauty, radiant skin, warm skin tone (NC25-NC40 range).
Approachable, relatable — not overly glamorous. Like a real person, not a magazine cover.
`;

const IMAGE_PROMPTS: Record<TemplateId, (topic: string) => string> = {
  "makeup-steps": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Close-up portrait of a woman applying makeup, mid-process. Theme: ${topic}.
She holds a beauty blender or brush near her face, looking at camera with a soft smile.
Dewy skin, soft makeup. Studio-style bright background, cream or blush tones.
  `,

  "daily-routine": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Woman doing her morning skincare routine. Theme: ${topic}.
She applies a serum or moisturizer, eyes slightly closed, relaxed expression. Natural window light.
Minimal background — bathroom mirror or bright white room. Fresh, airy, morning mood.
  `,

  "skin-tone-guide": (topic) => `
${STYLE_BASE}
Four Southeast Asian women with different skin tones standing or sitting together: fair, light brown, medium tan, deep brown.
All smiling naturally, minimal or no makeup, wearing neutral tops. Theme: ${topic}.
Warm natural lighting, clean cream background. Celebrating natural skin diversity.
  `,

  "acne-guide": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Close-up of a young Indonesian woman's clear, glowing skin after skincare. Theme: ${topic}.
Skin is smooth and dewy, slight natural texture visible — realistic not airbrushed.
Side-lighting to show skin texture. Soft green or white background for clean, clinical feel.
  `,

  "makeup-tutorial": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Finished makeup look on a young Southeast Asian woman. Theme: ${topic}.
She faces camera directly, confident smile. Full face look — blush, defined eyes, glossy lip.
Studio lighting, pastel or gradient background. Beauty campaign style.
  `,

  "lip-products": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Close-up of beautiful lips — a young woman showing off her lip makeup. Theme: ${topic}.
Slightly parted lips, glossy or matte finish depending on look. One hand lightly touches chin.
Warm blush background, lips are the clear focus. Clean and editorial.
  `,

  "skincare-ingredients": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Split composition: left side shows a young woman with glowing, hydrated skin (close-up face); right side shows fresh botanical ingredients — citrus, aloe vera, glass serums. Theme: ${topic}.
Clean white studio background. Science meets nature aesthetic.
  `,

  "clean-makeup": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Young woman wearing a soft, natural "no-makeup makeup" look. Theme: ${topic}.
Barely-there foundation, soft blush, clear gloss, brushed-up brows. Fresh and effortless.
Outdoor or bright indoor natural light. White or warm nude background.
  `,

  "makeup-checklist": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Woman sitting at her organized vanity, surrounded by her makeup collection. Theme: ${topic}.
She holds a makeup brush and looks into the mirror or at camera, playful expression.
Warm pink and beige tones, organized aesthetic vanity visible in background.
  `,

  "no-makeup-look": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Extremely close-up portrait of glowing bare skin — young Indonesian or Southeast Asian woman. Theme: ${topic}.
Zero or near-zero makeup, just healthy dewy skin. Golden hour soft sidelight.
Skin shows natural pores and texture — realistic, not filtered. Peachy and warm tones.
  `,

  "product-comparison": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Woman swatching three different beauty products on her inner arm or the back of her hand. Theme: ${topic}.
Products applied side by side in clean swatches. She looks at camera with a curious or evaluating expression.
Bright clean background, neutral tones. Informative and aesthetic.
  `,

  "beauty-annotated": (topic) => `
${STYLE_BASE}
${MODEL_BASE}
Full-face close-up portrait of a Southeast Asian woman with a complete, polished makeup look. Theme: ${topic}.
Face symmetrical and well-lit. Defined brows, glowing skin, blush, highlight, statement lip.
Clean gradient background — rose, blush, or lavender. Beauty campaign editorial style.
  `,
};

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { topic, templateId } = (await req.json()) as {
      topic: string;
      templateId: TemplateId;
    };

    if (!topic || !templateId) {
      return NextResponse.json({ error: "topic and templateId required" }, { status: 400 });
    }

    const promptFn = IMAGE_PROMPTS[templateId];
    if (!promptFn) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const imageResult = await generateGeminiImage(promptFn(topic));
    return NextResponse.json(imageResult);
  } catch (err) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
