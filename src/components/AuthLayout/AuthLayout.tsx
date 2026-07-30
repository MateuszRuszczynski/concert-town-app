import type { FC, ReactNode } from 'react';
import { Logo } from '../Logo';
import { ThemeSwitcher } from '../../hooks/ThemeSwitcher';
import styles from './AuthLayout.module.scss';

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
        <Logo />
      </div>

      <h1 id='auth-title' className={styles.title}>{title}</h1>

      <p className={styles.subtitle}>{subtitle}</p>
    </header>

    <div className={styles.body}>
      {children}

      <p className={styles.authSwitch}>{authSwitch}</p>
    </div>
  </section>
);
