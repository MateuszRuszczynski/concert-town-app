//#region imports
import { useNavigate } from 'react-router';
import { Button } from '../../../../components/Button';
import styles from './EventNotFound.module.scss';
//#endregion

export const EventNotFound = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.noFoundPage}>
      <div className={styles.noFoundBlock}>
        <h2 className={styles.title}>Event not found</h2>
        <p className={styles.subtitle}>This event may have been removed.</p>

        <Button variant='secondary' onClick={() => navigate('/events')}>Back to events</Button>
      </div>
    </section>
  );
};
