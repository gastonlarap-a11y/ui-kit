import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./tabs.js";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="usage">Usage</TabsTab>
        <TabsTab value="billing">Billing</TabsTab>
      </TabsList>
      <TabsPanel value="overview">
        Everything at a glance for this project.
      </TabsPanel>
      <TabsPanel value="usage">
        Requests, bandwidth and build minutes this month.
      </TabsPanel>
      <TabsPanel value="billing">Invoices and payment method.</TabsPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="audit" disabled>
          Audit log
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">Available on every plan.</TabsPanel>
      <TabsPanel value="audit">Enterprise only.</TabsPanel>
    </Tabs>
  ),
};

export const ArrowKeysSwitchPanels: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole("tab", { name: "Overview" });

    await expect(overview).toHaveAttribute("aria-selected", "true");

    overview.focus();
    await userEvent.keyboard("{ArrowRight}");

    // Base UI activates manually by default: the arrow moves focus, Enter selects.
    // Pass `activateOnFocus` to TabsList if you want the panel to follow the arrow.
    const usage = canvas.getByRole("tab", { name: "Usage" });
    await expect(usage).toHaveFocus();
    await expect(usage).toHaveAttribute("aria-selected", "false");

    await userEvent.keyboard("{Enter}");
    await expect(usage).toHaveAttribute("aria-selected", "true");

    // The panel must follow the tab, otherwise the state is a lie. `waitFor` because
    // both panels are briefly in the DOM while the outgoing one transitions out.
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent(
        /Requests, bandwidth/,
      ),
    );
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Selection has to be visible, not just announced. This shipped broken: the tab was
 * styled on `data-selected`, which Base UI does not set on `Tabs.Tab` (it sets
 * `data-active`), so the selected tab rendered with the same muted ink and a
 * transparent underline as the others and `aria-selected` was the only difference.
 * WCAG 1.4.1 — colour or not, the state cannot be conveyed by assistive tech alone.
 */
export const SelectedTabIsVisiblyDistinct: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selected = canvas.getByRole("tab", { name: "Overview" });
    const other = canvas.getByRole("tab", { name: "Usage" });

    await expect(selected).toHaveAttribute("aria-selected", "true");

    // The underline must actually be painted, not left transparent.
    const underline = getComputedStyle(selected).borderBottomColor;
    await expect(underline).not.toBe("rgba(0, 0, 0, 0)");
    await expect(underline).not.toBe(getComputedStyle(other).borderBottomColor);

    // And the ink has to step up from muted to full strength.
    await expect(getComputedStyle(selected).color).not.toBe(
      getComputedStyle(other).color,
    );
  },
};

/**
 * Selection here is carried by a 2px underline in `--ui-accent` plus a shift from
 * `--ui-fg-muted` to `--ui-fg`. Both signals are brand- or scheme-dependent, and the
 * underline is the one that has to stay visible against the list's own border.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Tabs defaultValue="overview">…</Tabs>',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand) => (
        <Tabs {...args} defaultValue="on" className="w-44">
          <TabsList>
            <TabsTab value="on">{brand}</TabsTab>
            <TabsTab value="off">Other</TabsTab>
          </TabsList>
          <TabsPanel value="on">Selected panel.</TabsPanel>
          <TabsPanel value="off">Hidden panel.</TabsPanel>
        </Tabs>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const selectedTab = (cell: HTMLElement) => {
      const tab = within(cell)
        .getAllByRole("tab")
        .find((t) => t.getAttribute("aria-selected") === "true");
      if (!tab) throw new Error("the matrix cell rendered no selected tab");
      return tab;
    };

    // The underline is the brand-carrying part.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", selectedTab, "borderBottomColor"),
    );

    // Selected and unselected ink must stay two different tokens, in both schemes.
    for (const scheme of ["light", "dark"] as const) {
      const cell = within(canvasElement).getByTestId(`cell-${scheme}-blue`);
      await expect(getComputedStyle(selectedTab(cell)).color).not.toBe(
        getComputedStyle(within(cell).getByRole("tab", { name: "Other" }))
          .color,
      );
    }

    await expectSchemesDiffer(canvasElement);
  },
};
