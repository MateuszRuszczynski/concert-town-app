//#region imports
import cn from 'classNames';
import type { FC } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { HomeLink } from '../../../HomeLink';
import { NavList } from '../NavList';
import { Button } from '../../../Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { AddEventButton } from '../../../AddEventButton';
import styles from './Sidebar.module.scss';
//#endregion

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isOrganizerOrAdmin, isLoading } = useAuth();

  const showAuthenticated = !isLoading && isAuthenticated;
  const showOrganizerPrompt =
    !isLoading && isAuthenticated && !isOrganizerOrAdmin;

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden='true' />
      )}

      <aside
        className={cn(styles.sidebar, {
          [styles.open]: isOpen
        })}
      >
        <div className={styles.topBar}>
          <HomeLink onClick={onClose} />

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close menu'
          >
            <X size={16} aria-hidden='true' />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavList onNavigate={onClose} />
        </nav>

        <div className={styles.actions}>
          {!showAuthenticated && (
            <>
              <Button
                onClick={() => {
                  navigate('/sign-in');
                  onClose();
                }}
              >
                Sign in
              </Button>
              <p className={styles.hint}>
                Sign in to attend and organize events
              </p>
            </>
          )}

          {showOrganizerPrompt && (
            <>
              <Button onClick={() => {}}>Become an organizer</Button>
              <p className={styles.hint}>
                Become an organizer to create and manage your own events
              </p>
            </>
          )}

          {showAuthenticated && <AddEventButton onNavigate={onClose} />}
        </div>
      </aside>
    </>
  );
};
