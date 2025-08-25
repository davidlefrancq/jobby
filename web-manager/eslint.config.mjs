import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// --- Inline plugin: enum key === value (string) ---
const enumKeyPlugin = {
  rules: {
    "enum-key-equals-value": {
      meta: {
        type: "problem",
        docs: { description: "Enforce TS enum string values to equal their keys" },
        schema: [],
        messages: {
          mustBeString: "Enum key '{{key}}' must initialize with a string literal equal to its name.",
          mismatch: "Enum key '{{key}}' must equal its string value.",
        },
      },
      create(context) {
        return {
          TSEnumMember(node) {
            // Key
            const key =
              node.id?.type === "Identifier"
                ? node.id.name
                : node.id?.type === "Literal"
                ? String(node.id.value)
                : null;
            if (!key) return;

            // Only check enums with explicit initializer
            if (!node.initializer) return;

            // Must be string literal and equal to key
            if (node.initializer.type !== "Literal" || typeof node.initializer.value !== "string") {
              context.report({ node: node.initializer, messageId: "mustBeString", data: { key } });
              return;
            }
            const value = String(node.initializer.value);
            if (key !== value) {
              context.report({ node: node.initializer, messageId: "mismatch", data: { key } });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "enum-key": enumKeyPlugin,
    },
    rules: {
      "enum-key/enum-key-equals-value": "error",
    },
  },
];

export default eslintConfig;
