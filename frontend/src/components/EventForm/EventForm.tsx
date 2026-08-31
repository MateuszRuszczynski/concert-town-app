//#region imports
import { FormError } from '../FormError';
import { Button } from '../Button';
import { EventDetailsSection } from './components/EventDetailsSection';
import { DateLocationSection } from './components/DateLocationSection';
import { CapacityPricingSection } from './components/CapacityPricingSection';
import { useEventForm } from '../../hooks/useEventForm';
import styles from './EventForm.module.scss';
import type { EventFormData } from '../../types/events';
import type { FC } from 'react';
//#endregion

interface Props {
  eventId?: string;
  initialValues?: EventFormData;
}

export const EventForm: FC<Props> = ({ eventId, initialValues }) => {
  const { values, onChange, validation, submission } = useEventForm(
    eventId,
    initialValues
  );
  const { fieldErrors } = validation;
  const {
    isSubmitting,
    submitError,
    handleSubmit,
    submitLabel,
    secondaryLabel,
    secondaryAction
  } = submission;

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.eventForm}>
      <EventDetailsSection
        values={{
          title: values.title,
          description: values.description,
          host: values.host,
          category: values.category
        }}
        onChange={{
          onTitleChange: onChange.setTitle,
          onDescriptionChange: onChange.setDescription,
          onHostChange: onChange.setHost,
          onCategoryChange: onChange.setCategory
        }}
        errors={{
          title: fieldErrors.title,
          description: fieldErrors.description,
          host: fieldErrors.host,
          category: fieldErrors.category
        }}
      />

      <DateLocationSection
        values={{
          startsAt: values.startsAt,
          endsAt: values.endsAt,
          isOnline: values.isOnline,
          city: values.city,
          venue: values.venue
        }}
        onChange={{
          onStartsAtChange: onChange.setStartsAt,
          onEndsAtChange: onChange.setEndsAt,
          onIsOnlineChange: onChange.setIsOnline,
          onCityChange: onChange.setCity,
          onVenueChange: onChange.setVenue
        }}
        errors={{
          startsAt: fieldErrors.startsAt,
          endsAt: fieldErrors.endsAt,
          city: fieldErrors.city,
          venue: fieldErrors.venue
        }}
      />

      <CapacityPricingSection
        values={{
          capacity: values.capacity.toString(),
          price: values.price.toString()
        }}
        onChange={{
          onCapacityChange: onChange.onCapacityChange,
          onPriceChange: onChange.onPriceChange
        }}
        errors={{ capacity: fieldErrors.capacity, price: fieldErrors.price }}
      />

      {submitError && <FormError errorMessage={submitError} />}

      <div className={styles.formButtons}>
        <Button
          type='button'
          fitContent={true}
          variant='secondary'
          onClick={secondaryAction}
          disabled={isSubmitting}
        >
          {secondaryLabel}
        </Button>

        <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting} fitContent={true}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
