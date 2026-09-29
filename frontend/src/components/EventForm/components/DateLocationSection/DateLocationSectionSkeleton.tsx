//#region imports
import { CheckboxSkeleton } from '../../../Checkbox';
import { FormFieldSkeleton } from '../../../FormField';
import { EventFormSection } from '../EventFormSection';
import baseStyles from './base.module.scss';
//#endregion

export const DateLocationSectionSkeleton = () => (
  <EventFormSection title='Capacity & pricing'>
    <>
      <FormFieldSkeleton label='Starts' />

      <FormFieldSkeleton label='Ends' />

      <div className={baseStyles.fullWidth}>
        <CheckboxSkeleton label='This is an online event' />
      </div>

      <FormFieldSkeleton label='City / Location' />

      <FormFieldSkeleton label='Venue' />
    </>
  </EventFormSection>
);
