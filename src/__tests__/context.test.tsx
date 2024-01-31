import React from "react";
import { createInternationalizationContext } from "../context";
import { render, screen } from "@testing-library/react";

describe("createInternationalizationProvider", () => {
  const {
    localize,
    InternationalizationProvider,
  } = createInternationalizationContext(["en-US", "sv-SE"] as const);

  describe("#localize", () => {
    it("supports fragments", async () => {
      const Trans = localize({
        "en-US": <>English text</>,
        "sv-SE": <>Swedish text</>,
      });

      render(
        <InternationalizationProvider initial='en-US'>
          <Trans />
        </InternationalizationProvider>,
      );

      await screen.findByText("English text");
    });

    it("renders variant based on set locale", async () => {
      const Trans = localize({
        "en-US": <>English text</>,
        "sv-SE": <>Swedish text</>,
      });

      render(
        <InternationalizationProvider initial='sv-SE'>
          <Trans />
        </InternationalizationProvider>,
      );

      await screen.findByText("Swedish text");
    });

    it("supports parameters", async () => {
      const Trans = localize<{ size: number }>({
        "en-US": ({ size }) => <>Size: {size}</>,
        "sv-SE": ({ size }) => <>Storlek: {size}</>,
      });

      render(
        <InternationalizationProvider initial='sv-SE'>
          <Trans size={5} />
        </InternationalizationProvider>,
      );

      await screen.findByText("Storlek: 5");
    });

    it("supports strings", async () => {
      const Trans = localize({
        "en-US": "Plain string",
        "sv-SE": "Vanlig sträng",
      });

      function Component() {
        return <input placeholder={Trans()} />;
      }

      render(
        <InternationalizationProvider initial='sv-SE'>
          <Component />
        </InternationalizationProvider>,
      );

      await screen.findByPlaceholderText("Vanlig sträng");
    });
  });
});
