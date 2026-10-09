//#region imports
import type { FC } from 'react';
import { IconButton } from '../../../ui/IconButton';
import { FileClock, Menu } from 'lucide-react';
import { HomeLink } from '../HomeLink';
import { ThemeSwitcher } from '../../../ui/ThemeSwitcher';
import { UserMenu } from '../UserMenu';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../../ui/Button';
import { useNavigate } from 'react-router';
import { OrganizerRequestsBadge } from '../../../organizer/OrganizerRequestsBadge';
import styles from './Header.module.scss';
//#endregion

interface Props {
  onMenuToggle: () => void;
}

export const Header: FC<Props> = ({ onMenuToggle }) => {
  const { isLoading, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  return (
    <header className={styles.header}>
      <div className={styles.headerStart}>
        <IconButton onClick={onMenuToggle} aria-label='Toggle menu'>
          <Menu size={16} aria-hidden='true' />
        </IconButton>

        <HomeLink />
      </div>

      <div className={styles.actions}>
        {!isLoading && isAdmin && <OrganizerRequestsBadge />}

        {!isLoading && isAuthenticated && !isAdmin && (
          <Button
            variant='secondary'
            fitContent={true}
            onClick={() => navigate('/my-organizer-request')}
          >
            <FileClock size={16} aria-hidden='true' />
            My requests status
          </Button>
        )}

        <ThemeSwitcher />

        <UserMenu />
      </div>
    </header>
  );
};
