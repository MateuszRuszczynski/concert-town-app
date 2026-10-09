import { FormFieldSkeleton } from '../../../../ui/FormField';
import { EventFormSection } from '../EventFormSection';

export const CapacityPricingSectionSkeleton = () => (
  <EventFormSection title='Capacity & pricing'>
    <>
      <FormFieldSkeleton label='Capacity' />

      <FormFieldSkeleton label='Ticket price (USD, 0 = free)' />
    </>
  </EventFormSection>
);
