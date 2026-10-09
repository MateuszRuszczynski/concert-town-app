//#region imports
import { BackLink } from '../../components/ui/BackLink';
import { ButtonSkeleton } from '../../components/ui/Button';
import { SkeletonItem } from '../../components/ui/SkeletonItem';
import { EventHeaderSkeleton } from './components/EventHeader';
import { EventHeroSkeleton } from './components/EventHero';
import { EventInfoPanelSkeleton } from './components/EventInfoPanel';
import { RegistrationProgressSkeleton } from './components/RegistrationProgress';
import baseStyles from './base.module.scss';
import styles from './EventPageSkeleton.module.scss';
//#endregion

export const EventPageSkeleton = () => (
  <div className={baseStyles.eventPage}>
    <BackLink to='/events' label='Back to events' />

    <EventHeroSkeleton />

    <div className={baseStyles.contentGrid}>
      <div className={baseStyles.mainColumn}>
        <EventHeaderSkeleton />

        <SkeletonItem additionalClass={styles.description} />

        <RegistrationProgressSkeleton />
      </div>

      <div className={baseStyles.sideColumn}>
        <EventInfoPanelSkeleton />

        <ButtonSkeleton />
      </div>
    </div>
  </div>
);
