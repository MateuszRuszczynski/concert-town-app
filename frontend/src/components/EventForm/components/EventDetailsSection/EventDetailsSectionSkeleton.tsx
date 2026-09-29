//#region imports
import { FormFieldSkeleton } from '../../../FormField';
import { EventFormSection } from '../EventFormSection';
import baseStyles from './base.module.scss';
//#endregion

export const EventDetailsSectionSkeleton = () => (
  <EventFormSection title='Event details'>
    <>
      <div className={baseStyles.fullWidth}>
        <FormFieldSkeleton label='Title' />
      </div>

      <div className={baseStyles.fullWidth}>
        <FormFieldSkeleton label='Description' />
      </div>

      <div className={baseStyles.fullWidth}>
        <FormFieldSkeleton label='Host' />
      </div>

      <FormFieldSkeleton label='Category' />

      <FormFieldSkeleton label='Status' />
    </>
  </EventFormSection>
);
