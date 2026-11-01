import React from 'react';
import styles from './SkeletonItem.module.scss';

interface Props {
  additionalClass?: string;
};

export const SkeletonItem: React.FC<Props> = ({ additionalClass }) => {
  return <div className={`${styles.skeletonItem} ${additionalClass}`.trim()} />;
};
