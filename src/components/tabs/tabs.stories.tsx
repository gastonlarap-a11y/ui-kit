import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
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
