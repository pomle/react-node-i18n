# React Node Internationalization

An internationalization library based on React components.

## Usage

1. Create setup file to create the i18n context.

```tsx
import { createInternationalizationContext } from "@pomle/react-node-i18n";

export enum Locale {
  enGB = "en_GB",
  svSE = "sv_SE",
}

const {
  localize,
  useLocale,
  InternationalizationProvider,
  useInternationalization,
} = createInternationalizationContext([Locale.enGB, Locale.svSE]);

export {
  localize,
  useLocale,
  InternationalizationProvider,
  useInternationalization,
};
```
   
2. Import `InternationalizationProvider` from setup file and mount in your app.

```tsx
import { RestOfTheApp } from "./App.tsx";
import { InternationalizationProvider, Locale } from "i18n/localization";

export function App() {
  return (
    <InternationalizationProvider initial={Locale.enGB}>
      <RestOfTheApp/>
    </InternationalizationProvider>
  );
}
```

3. Import and use `localize` function from setup file and call to create translation components. We recommend one sibling file per component called `trans.tsx` that export all translatables as a single object.

```tsx
import { localize } from "lib/i18n/localization";

const Title = localize({
  en_GB: <>My Age</>,
  sv_SE: <>Min ålder</>,
});

export const Trans = { Title };
```

4. Import translations and render.

```tsx
import { Trans } from "./trans";

export function AgeComponent({age}: {age: number}) {
  return <div>
    <Trans.Title> {age}
  </div>
}
```

## Reference

### `createInternationalizationContext`

Core function that creates all utilities needed.

### `localize`

Factory function returned by `createInternationalizationContext` that creates localizable components in your project.

### `useInternationalization`

Hook that provides access to currently selected locale and a setter function to set locale.

### `useLocale`

Convenience hook that returns only the currently selected locale.

### `InternationalizationProvider`

Context provider component that provides functionality for `useInternationalization` and `useLocale`. A basic implementation of a [React Context](https://react.dev/learn/passing-data-deeply-with-context).
