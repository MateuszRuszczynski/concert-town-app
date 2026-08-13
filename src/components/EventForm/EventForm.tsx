//#region imports
import { FormError } from "../FormError";
import { Button } from "../Button";
import { EventDetailsSection } from "./components/EventDetailsSection";
import { DateLocationSection } from "./components/DateLocationSection";
import { CapacityPricingSection } from "./components/CapacityPricingSection";
import { useEventForm } from "../../hooks/useEventForm";
import styles from "./EventForm.module.scss";
//#endregion

export const EventForm = () => {
  const { values, onChange, validation, submission } = useEventForm();
  const { fieldErrors } = validation;
  const { isSubmitting, submitError, clearForm, handleSubmit } = submission;

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
        values={{ capacity: values.capacity, price: values.price }}
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
          onClick={clearForm}
          disabled={isSubmitting}
        >
          Clear form
        </Button>

        <Button type='submit' disabled={isSubmitting} fitContent={true}>
          {isSubmitting ? 'Creating event…' : 'Create event'}
        </Button>
      </div>
    </form>
  );
};
