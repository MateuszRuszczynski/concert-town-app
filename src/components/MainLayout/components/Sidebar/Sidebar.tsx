//#region imports
import { Plus, X } from 'lucide-react';
import type { FC } from 'react';
import { HomeLink } from '../../../HomeLink';
import { Button } from '../../../Button';
import styles from './Sidebar.module.scss';
import cn from 'classnames';
import { NavList } from '../NavList';
import { useNavigate } from 'react-router';
//#endregion

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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

        <Button onClick={() => {
          navigate('/events/new')
          onClose();
        }}>
          <Plus size={16} />
          Add event
        </Button>
      </aside>
    </>
  );
};
