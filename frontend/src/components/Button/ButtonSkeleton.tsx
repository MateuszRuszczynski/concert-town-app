//#region imports
import cn from 'classNames';
import baseStyles from './base.module.scss';
import { SkeletonItem } from "../SkeletonItem";
import type { FC } from 'react';
//#endregion

interface Props {
  fitContent?: boolean;
  additionalClass?: string;
}

export const ButtonSkeleton:FC<Props> = ({ fitContent, additionalClass }) => (
  <SkeletonItem additionalClass={cn(baseStyles.button, additionalClass, {
    [baseStyles.fitContent]: fitContent,
  })} />
);
