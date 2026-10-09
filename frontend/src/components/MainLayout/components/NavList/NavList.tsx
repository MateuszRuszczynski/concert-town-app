//#region imports
import cn from 'classNames';
import {
  CalendarDays,
  CalendarPlus,
  LayoutDashboard,
  Ticket,
  TicketCheck,
  type LucideIcon
} from 'lucide-react';
import { NavLink } from 'react-router';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './NavList.module.scss';
//#endregion

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  children?: {
    to: string;
    label: string;
    icon?: LucideIcon;
    requiresOrganizer?: boolean;
  }[];
}

const BASE_NAV_ITEMS: NavItem[] = [
  {
    to: '/events',
    label: 'Events',
    icon: Ticket,
    children: [
      { to: '/events/my-registrations', label: 'My Registrations', icon: TicketCheck },
      { to: '/events/mine', label: 'My Events', icon: CalendarPlus, requiresOrganizer: true },
    ],
  },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
];

const DASHBOARD_NAV_ITEM: NavItem = { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard };

interface Props {
  onNavigate: () => void;
}

export const NavList = ({ onNavigate }: Props) => {
  const { isOrganizerOrAdmin, isAuthenticated } = useAuth();

  const navItems = isAuthenticated ? [DASHBOARD_NAV_ITEM, ...BASE_NAV_ITEMS] : BASE_NAV_ITEMS;

  return (
    <ul className={styles.navList}>
      {navItems.map(({ to, label, icon: Icon, children }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === '/events'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(styles.navLink, { [styles.active]: isActive })
            }
          >
            <Icon size={16} aria-hidden='true' />
            {label}
          </NavLink>

          {(children && isAuthenticated) && (
            <ul className={styles.subNavList}>
              {children
                .filter(child => !child.requiresOrganizer || isOrganizerOrAdmin)
                .map(({ to: childTo, label: childLabel, icon: ChildIcon }) => (
                  <li key={childTo}>
                    <NavLink
                      to={childTo}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(styles.subNavLink, { [styles.active]: isActive })
                      }
                    >
                      {ChildIcon && <ChildIcon size={14} aria-hidden='true' />}
                      {childLabel}
                    </NavLink>
                  </li>
                ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
