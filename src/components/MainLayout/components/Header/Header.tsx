//#region imports
import type { FC } from 'react';
import { ThemeSwitcher } from '../../../ThemeSwitcher';
import { IconButton } from '../../../IconButton';
import { Menu } from 'lucide-react';
import { UserMenu } from '../UserMenu';
import { HomeLink } from '../../../HomeLink';
import styles from './Header.module.scss';
//#endregion

interface Props {
  onMenuToggle: () => void;
}

export const Header: FC<Props> = ({ onMenuToggle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerStart}>
        <IconButton onClick={onMenuToggle} aria-label='Toggle menu'>
          <Menu size={16} aria-hidden='true' />
        </IconButton>

        <HomeLink />
      </div>

      <div className={styles.actions}>
        <ThemeSwitcher />

        <UserMenu />
      </div>
    </header>
  );
};
