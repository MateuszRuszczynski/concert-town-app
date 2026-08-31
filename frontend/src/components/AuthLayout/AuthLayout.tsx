//#region imports
import type { ReactNode, FC } from 'react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { Logo } from '../Logo';
import styles from './AuthLayout.module.scss';
//#endregion

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  authSwitch: ReactNode;
}

export const AuthLayout: FC<Props> = ({
  title,
  subtitle,
  children,
  authSwitch
}) => (
  <section className={styles.authLayout} aria-labelledby='auth-title'>
    <div className={styles.themeSwitcherWrapper}>
      <ThemeSwitcher />
    </div>

    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Logo variant='medium' />
      </div>

      <h1 id='auth-title' className={styles.title}>
        {title}
      </h1>

      <p className={styles.subtitle}>{subtitle}</p>
    </header>

    <div className={styles.body}>
      {children}

      <p className={styles.authSwitch}>{authSwitch}</p>
    </div>
  </section>
);
