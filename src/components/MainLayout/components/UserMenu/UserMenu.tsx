//#region imports
import { LogOut, User2Icon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, type FC } from 'react';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import styles from './UserMenu.module.scss';
//#endregion

interface Props {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const UserMenu: FC<Props> = ({ user }) => {
  const [isUserMenuShowed, setIsUserMenuShowed] = useState(false);
  const navigate = useNavigate();
  const menuRef = useOutsideClick(() => setIsUserMenuShowed(false));

  if (!user) {
    return (
      <button
        className={styles.userTrigger}
        onClick={() => navigate('/sign-in')}
        aria-label='Sign in'
      >
        <div className={`${styles.avatar} ${styles.unregistered}`}>
          <User2Icon size={22} />
        </div>

        <span className={styles.triggerLabel}>Sign in</span>
      </button>
    );
  }

  const userName = user.firstName + ' ' + user.lastName;
  const userInitials = user.firstName[0] + user.lastName[0];
  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.userTrigger}
        onClick={() => setIsUserMenuShowed(prev => !prev)}
      >
        <div className={styles.avatar}>{userInitials}</div>

        <span className={`${styles.triggerLabel} ${styles.onDesktopOnly}`}>
          {userName}
        </span>
      </button>

      {isUserMenuShowed && (
        <div className={styles.userMenuPanel}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>

            <span className={styles.userEmail}>{user.email}</span>
          </div>

          <hr className={styles.divider} />

          <button
            className={styles.signOutButton}
            onClick={() => navigate('/sign-in')}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};
