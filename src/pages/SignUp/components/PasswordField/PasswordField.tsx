//#region imports
import cn from 'classnames';
import { useState, type FC } from 'react';
import { FormField } from '../../../../components/FormField';
import { Check } from 'lucide-react';
import { PasswordVisibilityToggle } from '../../../../components/PasswordVisibilityToggle';
import styles from './PasswordField.module.scss';
//#endregion

interface Props {
  value: string;
  onChange: (value: string) => void;
  requirements: {
    label: string;
    met: boolean;
  }[];
  isValid: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const PasswordField: FC<Props> = ({
  value,
  onChange,
  requirements,
  isValid,
  successMessage,
  errorMessage
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.passwordField}>
      <FormField
        label='Password'
        id='password'
        type={isVisible ? 'text' : 'password'}
        placeholder='• • • • • • • •'
        value={value}
        onChange={e => onChange(e.target.value)}
        successMessage={successMessage}
        errorMessage={errorMessage}
        endAdornment={
          <PasswordVisibilityToggle isVisible={isVisible} onToggle={() => setIsVisible((prev) => !prev)} />
        }
        required
      />

      {value.length > 0 && !isValid && (
        <ul className={styles.requirementsList}>
          {requirements.map(req => (
            <li
              key={req.label}
              className={cn(styles.requirement, {
                [styles.checked]: req.met
              })}
            >
              <span className={styles.circle}>
                {req.met && <Check size={12} color='#fff' />}
              </span>

              {req.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
