import React, { createContext, useContext, useState } from "react";

interface InternationalizationContextProps<T> {
  initial: T;
  children: React.ReactNode;
}

export type Localizable<L extends readonly string[], T> = Record<L[number], T>;

export function createInternationalizationContext<
  Locales extends readonly string[]
>(locales: Locales) {
  type Locale = Locales[number];
  const fallback = locales[0] as Locale;

  type InternationalizationContextValue = {
    locale: Locale;
    setLocale(locale: Locale): void;
  };

  type Localizable<T> = Record<Locale, T>;

  const Context = createContext<InternationalizationContextValue | null>(null);

  function InternationalizationContext({
    initial,
    children,
  }: InternationalizationContextProps<Locale>) {
    const [locale, setLocale] = useState(initial);

    return (
      <Context.Provider value={{ locale, setLocale }}>
        {children}
      </Context.Provider>
    );
  }

  function useInternationalizationContext() {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(
        "useInternationalizationContext without InternationalizationContext",
      );
    }
    return value;
  }

  function useLocale() {
    return useInternationalizationContext().locale;
  }

  type Renderer<Props> =
    | Localizable<(props: Props) => React.ReactElement>
    | Localizable<React.ReactElement>
    | Localizable<(props: Props) => string>
    | Localizable<string>;

  function localize<Props>(
    renderers: Localizable<(props: Props) => React.ReactElement>,
  ): (props: Props) => JSX.Element;

  function localize(
    renderers: Localizable<React.ReactElement>,
  ): () => JSX.Element;

  function localize<Props>(
    renderers: Localizable<(props: Props) => string>,
  ): (props: Props) => JSX.Element;

  function localize(renderers: Localizable<string>): () => JSX.Element;

  function localize<Props = never>(
    renderers: Renderer<Props>,
  ): (props: Props) => React.ReactNode {
    function LocalizedComponent(props: Props) {
      const locale = useLocale();

      const renderer = renderers[locale] ?? renderers[fallback];
      if (renderer instanceof Function) {
        return renderer(props);
      }

      return renderer;
    }

    return LocalizedComponent;
  }

  return {
    InternationalizationContext,
    useInternationalizationContext,
    useLocale,
    localize,
  };
}
