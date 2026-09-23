import ar from "@/locales/ar.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

export type Language = "en" | "fr" | "ar";
export type Translations = typeof en;

const translations: Record<Language, Translations> = { en, fr, ar };

export function getTranslations(language: Language): Translations {
  return translations[language] ?? translations.en;
}