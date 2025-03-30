
# Custom I18n System
This is a custom internationalization (I18n) system built for React/Next.js to manage multiple languages in a web application. It provides a way to easily switch between different languages, retrieve translated strings based on keys, and store language preferences in cookies for persistent language selection.
## Installation

Install @hexstudiosar/i18n-react with npm

```bash
npm install @hexstudios/i18n-react
```
    
## Features:
- **Dynamic Language Switching**: Allows users to change the language from a dropdown or any UI component.

- **Translation Storage**: Translations are stored in JSON files, organized by language (e.g., en for English, es for Spanish).

- **Context-Based Language Management**: The I18n context allows any part of the application to access the current language and translations.

- **Automatic Language Persistence**: The selected language is stored in a cookie, so the language choice persists across page reloads.
## Usage

### 1. Setting up Translations
Translations are stored as JSON files in the locales/ directory. Each language has a corresponding JSON file that contains the translated strings.

**Example structure:**

```bash
/locales
  /en
    common.json
  /es
    common.json
```

**Example content of `locales/en/common.json`:**

```json
{
  "Navbar": {
    "links": {
      "labels": {
        "home": "Home",
        "about_me": "About me",
        "pricing": "Pricing",
        "docs": "Docs"
      }
    },
    "buttons": {
      "sign_in": "Sign in"
    }
  }
}
```

**Example content of `locales/es/common.json`:**

```json
{
  "Navbar": {
    "links": {
      "labels": {
        "home": "Inicio",
        "about_me": "Sobre mi",
        "pricing": "Precios",
        "docs": "Documentación"
      }
    },
    "buttons": {
      "sign_in": "Iniciar sesión"
    }
  }
}
```

### 2. I18n Context
The I18nProvider component is used to wrap the application and provide the context for translations. This component accepts translations (a record of language codes and their respective translation objects) and defaultLanguage (the default language to use if no language is set).

**Example of setting up `I18nProvider`:**

```tsx
import { I18nProvider } from "@/i18n/I18nContext";
import en from "@/locales/en/common.json";
import es from "@/locales/es/common.json";

const translations = {
  en,
  es,
};

<I18nProvider translations={translations} defaultLanguage="en">
  {/* Your app components */}
</I18nProvider>
```

### 3. Using Translations
Within any component, the useI18n hook can be used to access translation functionality. It provides access to:

- `translate`: A function to translate a string using a key.

- `language`: The current language being used.

- `setLanguage`: A function to change the language.

- `languages`: A list of all available languages.

**Example of using translate:**

```tsx
import { useI18n } from "@/i18n/I18nContext";

const Home = () => {
  const { translate } = useI18n();

  return (
    <div>
      <h1>{translate("Navbar.links.labels.home")}</h1>
      <p>{translate("Navbar.links.labels.about_me")}</p>
    </div>
  );
};
```

### 4. (Custom) Language Selector
The language selector allows users to choose a language from a dropdown, and the selected language is applied throughout the app.

**Example:**

```tsx
import { useI18n } from "@/i18n/I18nContext";

const LanguageSelector = () => {
  const { setLanguage, language, languages } = useI18n();

  return (
    <select onChange={(e) => setLanguage(e.target.value)} value={language}>
      {languages.map((lang, index) => (
        <option key={index} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
```

**Language can be set by using:**

```tsx
setLanguage("my-lang")
```

**Example:**

```tsx
setLanguage("es")
```

### 5. Handling Cookies
Language preference is stored in cookies so that it persists across page reloads. The cookie is set to expire in 365 days. The setLanguage function updates both the state and the cookie, while a getCookie function is used to read the saved language when the page is loaded.

### 6. Placeholder Replacement
Translations can include placeholders in the form of {{variable}}, which can be replaced with dynamic values using the interpolate function.

**Example:**

```json
{
  "welcome_message": "Hello, {{name}}!"
}
```

**In the component:**

```tsx
const { translate } = useI18n();
const message = translate("welcome_message", { name: "John" });
```

This would output: `"Hello, John!"`.

### 7. Error Handling
If a translation key is missing, a warning will be logged in the development environment, and the key itself will be returned as a fallback.


## Authors

- [@Hexpod604](https://github.com/Hexpod604)


## License

[MIT](https://choosealicense.com/licenses/mit/)

