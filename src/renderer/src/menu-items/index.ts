import { NavItemType } from '../types/menu';

const menuItems: NavItemType[] = [
  {
    id: 'group-pages',
    title: 'Pages',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard/default',
      },
    ],
  },
];

export default menuItems;
