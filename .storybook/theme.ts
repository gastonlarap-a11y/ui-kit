import { create } from "storybook/theming/create";

/**
 * The documentation chrome is painted with the kit's own palette.
 *
 * Values are hex, not `oklch` and not `var(...)`, and that is not a preference:
 * Storybook runs colour maths on every theme value through `polished`, which only
 * parses legacy CSS colour formats. Anything else throws `PolishedError` inside
 * `parseToRgb` and the whole manager renders blank.
 *
 * They are the sRGB equivalents of the tokens in `src/styles/tokens.css`, so the two
 * stay in step — recompute them if those change.
 */

const light = {
  canvas: "#f8fafd", // --ui-canvas, tinted toward the blue brand hue
  surface: "#ffffff", // --ui-surface
  fg: "#18181b", // --ui-fg
  fgMuted: "#51515c", // --ui-fg-muted
  border: "#e4e4e7", // --ui-border
  accent: "#0064dc", // --ui-accent (blue)
} as const;

const dark = {
  canvas: "#0d1013",
  surface: "#16181c",
  fg: "#fafafa",
  fgMuted: "#9ca2ab",
  border: "#2a2e35",
  accent: "#609efa",
} as const;

/** The kit never imposes a font family, so the docs inherit whatever the page uses. */
const typography = {
  fontBase: "inherit",
  fontCode: "ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

function docsThemeFor(base: "light" | "dark", c: typeof light | typeof dark) {
  return create({
    base,
    ...typography,

    colorPrimary: c.accent,
    colorSecondary: c.accent,

    appBg: c.canvas,
    appContentBg: c.canvas,
    appPreviewBg: c.surface,
    appBorderColor: c.border,
    appBorderRadius: 10,

    textColor: c.fg,
    textMutedColor: c.fgMuted,

    barBg: c.surface,
    barTextColor: c.fgMuted,
    barHoverColor: c.accent,
    barSelectedColor: c.accent,

    inputBg: c.surface,
    inputBorder: c.border,
    inputTextColor: c.fg,
    inputBorderRadius: 8,
  });
}

export const docsLight = docsThemeFor("light", light);
export const docsDark = docsThemeFor("dark", dark);

/**
 * The manager is a separate document with its own static theme — `addons.setConfig`
 * runs once and cannot follow the toolbar. It is fixed to dark on purpose: a stable
 * dark chrome around content that switches reads as deliberate, whereas a light
 * sidebar next to a dark page reads as broken.
 */
export const managerTheme = create({
  base: "dark",
  ...typography,

  brandTitle: "@galarap/ui",
  brandUrl: "https://github.com/gastonlarap-a11y/ui-kit",
  brandTarget: "_blank",

  colorPrimary: dark.accent,
  colorSecondary: dark.accent,

  appBg: dark.canvas,
  appContentBg: dark.surface,
  appPreviewBg: dark.surface,
  appBorderColor: dark.border,
  appBorderRadius: 10,

  textColor: dark.fg,
  textMutedColor: dark.fgMuted,

  barBg: dark.canvas,
  barTextColor: dark.fgMuted,
  barHoverColor: dark.accent,
  barSelectedColor: dark.accent,

  inputBg: dark.surface,
  inputBorder: dark.border,
  inputTextColor: dark.fg,
  inputBorderRadius: 8,
});
