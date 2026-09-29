//#region imports
import { ButtonSkeleton } from '../Button';
import { CapacityPricingSectionSkeleton } from './components/CapacityPricingSection';
import { DateLocationSectionSkeleton } from './components/DateLocationSection';
import { EventDetailsSectionSkeleton } from './components/EventDetailsSection';
import baseStyles from './base.module.scss';
import styles from './EventFormSkeleton.module.scss';
//#endregion

export const EventFormSkeleton = () => (
  <div className={baseStyles.eventForm}>
    <EventDetailsSectionSkeleton />

    <DateLocationSectionSkeleton />

    <CapacityPricingSectionSkeleton />

    <div className={baseStyles.formButtons}>
      <ButtonSkeleton additionalClass={styles.button} fitContent={true} />

      <ButtonSkeleton additionalClass={styles.button} fitContent={true} />
    </div>
  </div>
);
