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

  const Context = createContext<InternationalizationContextValue>({
    locale: fallback,
    setLocale() {
      throw new Error("setLocale called on dummy context");
    },
  });

  function InternationalizationProvider({
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

  function useInternationalization() {
    return useContext(Context);
  }

  function useLocale() {
    return useInternationalization().locale;
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
  ): (props: Props) => string;

  function localize(renderers: Localizable<string>): () => string;

  function localize<Props = never>(
    renderers: Renderer<Props>,
  ): (props: Props) => React.ReactNode {
    function LocalizedComponent(props: Props): React.ReactNode {
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
    InternationalizationProvider,
    useInternationalization,
    useLocale,
    localize,
  };
}
