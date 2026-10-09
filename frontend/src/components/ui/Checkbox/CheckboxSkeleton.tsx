//#region imports
import type { FC, ReactNode } from 'react';
import { SkeletonItem } from '../SkeletonItem';
import baseStyles from './base.module.scss';
//#endregion

interface Props {
  label: ReactNode;
}

export const CheckboxSkeleton: FC<Props> = ({ label }) => (
  <div className={baseStyles.control}>
    <SkeletonItem additionalClass={baseStyles.checkbox} />

    <label className={baseStyles.label}>{label}</label>
  </div>
);
