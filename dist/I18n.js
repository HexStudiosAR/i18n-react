"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useI18n = exports.I18nProvider = void 0;
var react_1 = __importStar(require("react"));
var I18nContext = (0, react_1.createContext)(undefined);
var LANGUAGE_COOKIE_KEY = "language";
var getCookie = function (name) {
    var match = document.cookie
        .split("; ")
        .find(function (row) { return row.startsWith(name + "="); });
    return match ? match.split("=")[1] : undefined;
};
var setCookie = function (name, value, days) {
    if (days === void 0) { days = 365; }
    var expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = "".concat(name, "=").concat(value, "; expires=").concat(expires.toUTCString(), "; path=/; secure=").concat(process.env.NODE_ENV === "production", "; SameSite=Strict;");
};
/**
 * Escapes a string to ensure it is safe to use in HTML contexts.
 *
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
var escapeHtml = function (str) {
    var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
        "`": "&#96;",
        "=": "&#61;",
        "/": "&#47;",
    };
    return str.replace(/[&<>"'`=\/]/g, function (match) { return map[match] || match; });
};
/**
 * Retrieves a nested translation value based on a dot-separated key path.
 *
 * @param {TranslationsType | string | undefined} obj - The object containing translations.
 * @param {string[]} keys - The path of keys as an array.
 * @returns {string | TranslationsType | undefined} The nested translation value, if found.
 */
var getNestedValue = function (obj, keys) {
    return keys.reduce(function (acc, key) {
        if (acc && typeof acc === "object") {
            return acc[key];
        }
        return undefined;
    }, obj);
};
/**
 * Replaces placeholders in the translation string with provided variable values.
 *
 * @param {string} str - The translation string containing placeholders in the form {{variable}}.
 * @param {{ [key: string]: string | number }} variables - An object with variable keys and their replacements.
 * @returns {string} The final translation string with interpolated variables.
 */
var interpolate = function (str, variables) {
    return str.replace(/{{\s*(\w+)\s*}}/g, function (match, key) {
        // If the variable exists, escape it and replace the placeholder
        var value = variables[key];
        return value !== undefined ? escapeHtml(String(value)) : match;
    });
};
/**
 * I18nProvider component to manage internationalization context.
 *
 * @param {I18nProviderProps} props - Component properties including children, defaultLanguage, and translations.
 * @returns {JSX.Element} The provider wrapping its children.
 */
var I18nProvider = function (_a) {
    var children = _a.children, _b = _a.defaultLanguage, defaultLanguage = _b === void 0 ? "en" : _b, translations = _a.translations;
    var _c = (0, react_1.useState)(function () {
        if (typeof document !== "undefined") {
            return getCookie(LANGUAGE_COOKIE_KEY) || defaultLanguage;
        }
        return defaultLanguage;
    }), language = _c[0], setLanguageState = _c[1];
    var _d = (0, react_1.useState)(false), isClient = _d[0], setIsClient = _d[1];
    /**
     * Sets the current language and persists it in cookies.
     *
     * @param {Language} newLanguage - The new language to be set.
     */
    var setLanguage = (0, react_1.useCallback)(function (newLanguage) {
        setLanguageState(newLanguage);
        setCookie(LANGUAGE_COOKIE_KEY, newLanguage);
    }, []);
    (0, react_1.useEffect)(function () {
        setIsClient(true);
    }, []);
    /**
     * Translates a key into its corresponding string based on the current language.
     * Falls back to the default language if the key is missing.
     *
     * @param {string} key - Dot-separated key (e.g., "greeting.hello").
     * @param {{ [key: string]: string | number }} [variables={}] - Variables for interpolation in the translation string.
     * @returns {string} The translated string or the key if translation is not found.
     */
    var translate = (0, react_1.useCallback)(function (key, variables) {
        if (variables === void 0) { variables = {}; }
        var keyPath = key.split(".");
        var currentTranslation = getNestedValue(translations[language], keyPath);
        var fallbackTranslation = getNestedValue(translations[defaultLanguage], keyPath);
        var translationString;
        if (typeof currentTranslation === "string") {
            translationString = currentTranslation;
        }
        else if (typeof fallbackTranslation === "string") {
            translationString = fallbackTranslation;
        }
        if (translationString) {
            return interpolate(translationString, variables);
        }
        if (process.env.NODE_ENV !== "production") {
            console.warn("Missing translation for key: ".concat(key));
        }
        return key;
    }, [language, translations, defaultLanguage]);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        language: language,
        setLanguage: setLanguage,
        translate: translate,
        translations: translations,
        languages: Object.keys(translations),
    }); }, [language, setLanguage, translate, translations]);
    if (!isClient) {
        return null;
    }
    return (react_1.default.createElement(I18nContext.Provider, { value: contextValue }, children));
};
exports.I18nProvider = I18nProvider;
/**
 * Custom hook to access the internationalization context.
 *
 * @returns {I18nContextType} The i18n context value.
 * @throws {Error} If the hook is used outside of an I18nProvider.
 */
var useI18n = function () {
    var context = (0, react_1.useContext)(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
};
exports.useI18n = useI18n;
