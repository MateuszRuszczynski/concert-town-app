//#region imports
import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';
import cn from 'classNames';
import baseStyles from './base.module.scss';
import styles from './StatCard.module.scss';
//#endregion

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  footer: string;
}

export const StatCard: FC<Props> = ({ icon: Icon, label, value, footer }) => (
  <div className={cn(baseStyles.statCard, styles.statCard)}>
    <div className={baseStyles.header}>
      <p className={styles.label}>{label}</p>

      <div className={cn(baseStyles.iconBlock, styles.iconBlock)}>
        <Icon size={18} className={styles.icon} />
      </div>
    </div>

    <div className={baseStyles.main}>
      <p className={styles.value}>{value}</p>
      <p className={styles.footer}>{footer}</p>
    </div>
  </div>
);
