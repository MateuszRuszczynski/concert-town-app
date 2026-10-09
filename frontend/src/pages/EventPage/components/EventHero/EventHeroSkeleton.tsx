import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import baseStyles from './base.module.scss';

export const EventHeroSkeleton = () => (
  <SkeletonItem additionalClass={baseStyles.hero} />
);
