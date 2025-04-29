import { convertToSupportedLocaleIn } from "@pistonite/pure/pref";

export const SupportedLocales = [
    "de-DE",
    "en-US",
    "es-ES",
    "fr-FR",
    "it-IT",
    "ja-JP",
    "ko-KR",
    "nl-NL",
    "ru-RU",
    "zh-CN",
    "zh-TW",
] as const;

export const loadSharedControlLanguage = async (language: string) => {
    const langToLoad =
        convertToSupportedLocaleIn(language, SupportedLocales) || "en-US";
    const strings = (await import(`./strings/${langToLoad}.yaml`)).default;
    return strings;
};

export const namespace = "shared-controls";
