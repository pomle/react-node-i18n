import React from "react";
import { createInternationalizationContext } from "../context";
import { render, screen } from "@testing-library/react";

describe("createInternationalizationContext", () => {
  const {
    localize,
    InternationalizationContext,
  } = createInternationalizationContext(["en-US", "sv-SE"] as const);

  describe("#localize", () => {
    it("supports fragments", async () => {
      const Trans = localize({
        "en-US": <>English text</>,
        "sv-SE": <>Swedish text</>,
      });

      render(
        <InternationalizationContext initial='en-US'>
          <Trans />
        </InternationalizationContext>,
      );

      await screen.findByText("English text");
    });

    it("renders variant based on set locale", async () => {
      const Trans = localize({
        "en-US": <>English text</>,
        "sv-SE": <>Swedish text</>,
      });

      render(
        <InternationalizationContext initial='sv-SE'>
          <Trans />
        </InternationalizationContext>,
      );

      await screen.findByText("Swedish text");
    });

    it("supports parameters", async () => {
      const Trans = localize<{ size: number }>({
        "en-US": ({ size }) => <>Size: {size}</>,
        "sv-SE": ({ size }) => <>Storlek: {size}</>,
      });

      render(
        <InternationalizationContext initial='sv-SE'>
          <Trans size={5} />
        </InternationalizationContext>,
      );

      await screen.findByText("Storlek: 5");
    });

    it("supports strings", async () => {
      const Trans = localize({
        "en-US": "Plain string",
        "sv-SE": "Vanlig sträng",
      });

      render(
        <InternationalizationContext initial='sv-SE'>
          <Trans />
        </InternationalizationContext>,
      );

      await screen.findByText("Vanlig sträng");
    });
  });
});
