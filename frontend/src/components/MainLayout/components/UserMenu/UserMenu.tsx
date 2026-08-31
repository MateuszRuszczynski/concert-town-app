//#region imports
import cn from 'classNames';
import { useState } from 'react';
import { LogOut, User2Icon } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext/useAuth';
import { useNavigate } from 'react-router';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import styles from './UserMenu.module.scss';
import type { UserRole } from '../../../../types/user';
import { capitalizeFirstWord } from '../../../../utils/capitalizeFirstWord';
//#endregion

const ROLE_LABELS: Record<UserRole, string> = {
  customer: '',
  organizer: 'Organizer',
  admin: 'Admin'
};

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isUserMenuShowed, setIsUserMenuShowed] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/sign-in');
    } finally {
      setIsSigningOut(false);
    }
  };

  const userName = user.firstName + ' ' + user.lastName;
  const userInitials = user.firstName[0] + user.lastName[0];

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.userTrigger}
        onClick={() => setIsUserMenuShowed(prev => !prev)}
      >
        <div className={cn(styles.avatar, styles[user.role])}>
          {userInitials}
        </div>

        <span className={cn(styles.triggerLabel, styles.onDesktopOnly)}>
          {userName}
        </span>
      </button>

      {isUserMenuShowed && (
        <div className={styles.userMenuPanel}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>

            <span className={styles.userEmail}>{user.email}</span>

            {user.role !== 'customer' && (
              <span className={cn(styles.roleBadge, styles[user.role])}>
                {capitalizeFirstWord(ROLE_LABELS[user.role])}
              </span>
            )}
          </div>

          <hr className={styles.divider} />

          <button
            className={styles.signOutButton}
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut size={16} />

            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
};
