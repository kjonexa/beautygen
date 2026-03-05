export type TemplateId =
  | "makeup-steps"
  | "daily-routine"
  | "skin-tone-guide"
  | "acne-guide"
  | "makeup-tutorial"
  | "lip-products"
  | "skincare-ingredients"
  | "clean-makeup"
  | "makeup-checklist"
  | "no-makeup-look"
  | "product-comparison"
  | "beauty-annotated";

export type ColorTheme =
  | "rose"
  | "cream"
  | "sage"
  | "lavender"
  | "dark"
  | "golden";

export interface ThemeColors {
  bg: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textLight: string;
  border: string;
  badge: string;
  badgeText: string;
}

// --- Template Content Types ---

export interface MakeupStepsContent {
  title: string;
  subtitle?: string;
  steps: { number: number; title: string; description?: string }[];
  tip?: string;
}

export interface DailyRoutineContent {
  title: string;
  subtitle?: string;
  steps: { number: number; name: string; products?: string; tip?: string }[];
  finalTip?: string;
}

export interface SkinToneContent {
  title: string;
  tones: {
    name: string;
    characteristics: string;
    foundationShade: string;
    recommendations: string[];
    avoid?: string;
  }[];
}

export interface AcneGuideContent {
  title: string;
  types: {
    name: string;
    color: string;
    ciri: string[];
    caraAtasi: string[];
  }[];
}

export interface MakeupTutorialContent {
  title: string;
  lookName: string;
  steps: {
    number: number;
    name: string;
    detail: string;
    tip?: string;
  }[];
  note?: string;
}

export interface LipProductsContent {
  title: string;
  products: {
    name: string;
    description: string;
    karakteristik: string[];
    bestFor: string;
    kekurangan?: string;
  }[];
}

export interface SkincareIngredientsContent {
  title: string;
  concerns: {
    name: string;
    ingredients: string[];
  }[];
}

export interface CleanMakeupContent {
  title: string;
  subtitle: string;
  keyPoints: string[];
  steps?: { name: string; tip: string }[];
  tagline?: string;
}

export interface MakeupChecklistContent {
  title: string;
  subtitle?: string;
  categories: {
    name: string;
    items: { text: string; detail?: string }[];
  }[];
}

export interface NoMakeupLookContent {
  title: string;
  subtitle?: string;
  sections: {
    name: string;
    tip?: string;
    items: string[];
  }[];
}

export interface ProductComparisonContent {
  title: string;
  products: string[];
  features: { name: string; values: string[] }[];
}

export interface BeautyAnnotatedContent {
  title: string;
  subtitle?: string;
  areas: {
    zone: string;
    product: string;
    tip: string;
    icon?: string;
  }[];
  finalNote?: string;
}

export type TemplateContent =
  | MakeupStepsContent
  | DailyRoutineContent
  | SkinToneContent
  | AcneGuideContent
  | MakeupTutorialContent
  | LipProductsContent
  | SkincareIngredientsContent
  | CleanMakeupContent
  | MakeupChecklistContent
  | NoMakeupLookContent
  | ProductComparisonContent
  | BeautyAnnotatedContent;

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}
