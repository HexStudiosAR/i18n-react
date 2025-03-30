import React, { ReactNode } from "react";
/**
 * TranslationsType represents a nested object where keys map to either a string translation or further nested translation objects.
 */
export type TranslationsType = {
    [key: string]: string | TranslationsType;
};
/**
 * Language type allows any string so that users can define language codes dynamically.
 */
export type Language = string;
interface I18nContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    translate: (key: string, variables?: {
        [key: string]: string | number;
    }) => string;
    languages: Language[];
}
interface I18nProviderProps {
    children: ReactNode;
    defaultLanguage?: Language;
    translations: Record<Language, TranslationsType>;
}
/**
 * I18nProvider component to manage internationalization context.
 *
 * @param {I18nProviderProps} props - Component properties including children, defaultLanguage, and translations.
 * @returns {JSX.Element} The provider wrapping its children.
 */
export declare const I18nProvider: React.FC<I18nProviderProps>;
/**
 * Custom hook to access the internationalization context.
 *
 * @returns {I18nContextType} The i18n context value.
 * @throws {Error} If the hook is used outside of an I18nProvider.
 */
export declare const useI18n: () => I18nContextType;
export {};
