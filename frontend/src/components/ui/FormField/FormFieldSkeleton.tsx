//#region imports
import type { FC, ReactNode } from 'react';
import { SkeletonItem } from '../SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './FormFieldSkeleton.module.scss';
//#endregion

interface Props {
  label?: ReactNode;
}

export const FormFieldSkeleton: FC<Props> = ({ label }) => (
  <div className={baseStyles.formfield}>
    <label className={baseStyles.label}>
      {label}
    </label>

    <SkeletonItem additionalClass={styles.input} />
  </div>
);
