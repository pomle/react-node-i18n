import React from "react";
import { renderToString } from "react-dom/server";

export function text(Component: React.ReactElement | string) {
  const R = (Component as unknown) as (props: unknown) => JSX.Element;
  return renderToString(<R />);
}
