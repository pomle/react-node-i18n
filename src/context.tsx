import React, { createContext, useContext } from "react";

interface InternationalizationContextProps<T> {
  locale: T;
  onChange?: (locale: T) => void;
  children: React.ReactNode;
}

function setLocale() {
  throw new Error("InternationalizationProvider onChange not configured");
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
    setLocale,
  });

  function InternationalizationProvider({
    locale,
    onChange = setLocale,
    children,
  }: InternationalizationContextProps<Locale>) {
    return (
      <Context.Provider value={{ locale, setLocale: onChange }}>
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
