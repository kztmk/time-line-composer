import type { Meta, StoryObj } from '@storybook/react';
import NavItem from '../../../layout/MainLayout/Drawer/DrawerContent/Navigation/NavItem';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Nav Item',
  component: NavItem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    item: {
      id: 'dashboard',
      title: 'dashboard',
      type: 'collapse',
      icon: 'dashboard',
      children: [
        {
          id: 'default',
          title: 'default',
          type: 'item',
          url: '/dashboard/default',
          breadcrumbs: false,
        },
        {
          id: 'analytics',
          title: 'analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false,
        },
      ],
    },
    level: 0,
  },
};
