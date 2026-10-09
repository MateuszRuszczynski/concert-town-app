//#region imports
import { Button } from '../../components/ui/Button';
import type { FC, ReactNode } from 'react';
import { Lock, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router';
import styles from './ErrorPage.module.scss';
//#endregion

interface Props {
  type?: 'not-found' | 'access-denied';
  title: string;
  subtitle: string;
  buttonText: string;
  backTo: string;
  children?: ReactNode;
}

export const ErrorPage: FC<Props> = ({
  type = 'not-found',
  title,
  subtitle,
  buttonText,
  backTo,
  children
}) => {
  const navigate = useNavigate();

  return (
    <section className={styles.accessDeniedPage}>
      <div className={styles.mainBlock}>
        {type === 'not-found' ? (
          <SearchX size={32} className={styles.searchXIcon} />
        ) : (
          <Lock size={32} className={styles.lockIcon} />
        )}

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.actions}>
          {children}

          <Button fitContent={true} variant='secondary' onClick={() => navigate(backTo)}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
};
