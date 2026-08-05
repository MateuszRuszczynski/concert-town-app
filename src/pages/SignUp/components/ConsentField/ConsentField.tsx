//#region imports
import type { FC } from 'react';
import { Link } from 'react-router';
import styles from './ConsentField.module.scss';
//#endregion

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  errorMessage?: string;
}

export const ConsentField: FC<Props> = ({
  checked,
  onChange,
  errorMessage
}) => (
  <div className={styles.consentField}>
    <div className={styles.consentControl}>
      <input
        type='checkbox'
        id='terms-consent'
        className={styles.checkbox}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />

      <label htmlFor='terms-consent' className={styles.label}>
        I agree to the{' '}
        <Link
          to='/terms'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
        >
          Terms and Conditions
        </Link>
      </label>
    </div>

    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  </div>
);
