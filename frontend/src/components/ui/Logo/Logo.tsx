//#region imports
import type { FC } from "react";
import cn from "classNames";
import { CalendarDays } from "lucide-react";
import styles from "./Logo.module.scss";
//#endregion

interface Props {
  variant?: 'small' | 'medium';
}

export const Logo: FC<Props> = ({ variant = 'small' }) => (
  <div
    className={cn(styles.logo, {
      [styles.medium]: variant === 'medium'
    })}
  >
    <CalendarDays
      size={variant === 'medium' ? 22 : 18}
      color='#fff'
      aria-hidden='true'
    />
  </div>
);
