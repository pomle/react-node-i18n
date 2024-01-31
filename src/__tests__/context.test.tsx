import React from "react";
import { createInternationalizationContext } from "../context";
import { render, screen } from "@testing-library/react";

describe("createInternationalizationProvider", () => {
  const {
    localize,
    useInternationalization,
    InternationalizationProvider,
  } = createInternationalizationContext(["en-US", "sv-SE"] as const);

  describe("#localize", () => {
    it("supports fragments", async () => {
      const Trans = localize({
        "en-US": <>English text</>,
        "sv-SE": <>Swedish text</>,
      });

      render(
        <InternationalizationProvider locale='en-US'>
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
        <InternationalizationProvider locale='sv-SE'>
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
        <InternationalizationProvider locale='sv-SE'>
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

      render(
        <InternationalizationProvider locale='sv-SE'>
          <Trans />
        </InternationalizationProvider>,
      );

      await screen.findByText("Vanlig sträng");
    });

    it("supports strictly strings", async () => {
      const Trans = localize({
        "en-US": "Plain string",
        "sv-SE": "Vanlig sträng",
      });

      function Component() {
        return <input placeholder={Trans()} />;
      }

      render(
        <InternationalizationProvider locale='sv-SE'>
          <Component />
        </InternationalizationProvider>,
      );

      await screen.findByPlaceholderText("Vanlig sträng");
    });

    it("supports strictly strings with args", async () => {
      const Trans = localize<{ age: number }>({
        "en-US": ({ age }) => `Age: ${age}`,
        "sv-SE": ({ age }) => `Ålder: ${age}`,
      });

      function Component() {
        return <input placeholder={Trans({ age: 6 })} />;
      }

      render(
        <InternationalizationProvider locale='sv-SE'>
          <Component />
        </InternationalizationProvider>,
      );

      await screen.findByPlaceholderText("Ålder: 6");
    });
  });

  describe("#InternationalizationProvider", () => {
    it("throws if setLocale called without onChange", async () => {
      function Component() {
        const { setLocale } = useInternationalization();

        expect(() => {
          setLocale("en-US");
        }).toThrow(
          new Error("InternationalizationProvider onChange not configured"),
        );

        return null;
      }

      render(
        <InternationalizationProvider locale='en-US'>
          <Component />
        </InternationalizationProvider>,
      );
    });

    it("calls configured onChange for setLocale ", async () => {
      function Component() {
        const { setLocale } = useInternationalization();

        setLocale("en-US");

        return null;
      }

      const setLocale = jest.fn();

      render(
        <InternationalizationProvider locale='en-US' onChange={setLocale}>
          <Component />
        </InternationalizationProvider>,
      );

      expect(setLocale).toHaveBeenCalledWith("en-US");
    });
  });
});
