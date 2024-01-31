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
    <InternationalizationProvider locale={Locale.enGB}>
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

*This is the function you will use the most.* 

It requires a specification for each language to be set, and then ensures that the correct output emitted based on the set locale.

```tsx
import { localize } from "lib/i18n/localization"; // Your setup file

const Age = localize<{age: number}>({
  en_GB: ({age}) => <>My age: {age}</>,
  sv_SE: ({age}) => <>Min ålder: {age}</>,
});

function MyComponent() {
  return <div>
    <h1><Age age={37} /></h1>
  </div
}
```

#### It provides three ways to define translations.

1. Strings when you want simplicity.
   
```tsx
const Age = localize({
  en_GB: "Age",
  sv_SE: "Ålder",
});
```

2. React Fragments for when you need to output HTML.
   
```tsx
const Age = localize({
  en_GB: <>My <b>Age</b></>,
  sv_SE: <>Min <b>Ålder</b></>,
});
```

3. React component for when you need arguments and templating.
   
```tsx
const Age = localize<{age: number}>({
  en_GB: <>My Age is <b>{age}</b></>,
  sv_SE: <>Min ålder är <b>{age}</b></b>,
});
```

Emit translation by mounting component.

```tsx
const Age = localize({
  "en-US": "Age",
  "sv-SE": "Ålder",
});

function Component() {
  return <div>
    <Age/>
  </div>
}
```

When translation defined without HTML you can call it as a function to emit it's string value.

```tsx
const Age = localize({
  "en-US": "Age",
  "sv-SE": "Ålder",
});

function Component() {
  return <input placeholder={Age()} />;
}
```


### `useInternationalization`

Hook that provides access to currently selected locale and a setter function to set locale.

### `useLocale`

Convenience hook that returns only the currently selected locale.

### `InternationalizationProvider`

Context provider component that provides functionality for `useInternationalization` and `useLocale`. A basic implementation of a [React Context](https://react.dev/learn/passing-data-deeply-with-context).
