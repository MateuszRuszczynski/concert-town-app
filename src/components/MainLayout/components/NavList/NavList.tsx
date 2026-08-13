//#region imports
import cn from "classNames";
import { CalendarDays, LayoutDashboard, Ticket } from "lucide-react";
import { NavLink } from "react-router";
import styles from './NavList.module.scss';
//#endregion

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: Ticket },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays }
];

interface Props {
  onNavigate: () => void;
}

export const NavList = ({ onNavigate }: Props) => (
  <ul className={styles.navList}>
    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
      <li key={to}>
        <NavLink
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(styles.navLink, { [styles.active]: isActive })
          }
        >
          <Icon size={16} aria-hidden='true' />
          {label}
        </NavLink>
      </li>
    ))}
  </ul>
);
