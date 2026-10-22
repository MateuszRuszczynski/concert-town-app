//#region imports
import { useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router';
import {
  validateDateRange,
  validateEventDescription,
  validateEventHost,
  validateEventTitle,
  validateStartDate
} from '../utils/eventValidation';
import { useEvents } from '../contexts/EventContext/useEvents';
import type { EventFormData, EventStatus } from '../types/events';
import { useNotification } from '../contexts/NotificationContext';
import { normalizeNumericInput } from '../utils/normalizeNumericInput';
import {
  fromDateTimeInputValue,
  toDateTimeInputValue
} from '../utils/dateTimeInputFormat';
import { getErrorMessage } from '../utils/getErrorMessage';
//#endregion

export function useEventForm (
  eventId: number | undefined,
  initialValues: EventFormData | undefined
) {
  const isInitialOnline = initialValues?.location === 'online';
  const initialOfflineLocation =
    initialValues?.location && initialValues.location !== 'online'
      ? initialValues.location
      : undefined;

  //#region input controls;
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(
    initialValues?.description || ''
  );
  const [host, setHost] = useState(initialValues?.host || '');
  const [categoryId, setCategoryId] = useState<number>(
    initialValues?.categoryId || 0
  );
  const [startsAt, setStartsAt] = useState(
    toDateTimeInputValue(initialValues?.startsAt || '')
  );
  const [endsAt, setEndsAt] = useState(
    toDateTimeInputValue(initialValues?.endsAt || '')
  );
  const [isOnline, setIsOnline] = useState(isInitialOnline);
  const [city, setCity] = useState(initialOfflineLocation?.city ?? '');
  const [venue, setVenue] = useState(initialOfflineLocation?.venue ?? '');
  const [capacity, setCapacity] = useState(initialValues?.capacity || '100');
  const [price, setPrice] = useState(initialValues?.price || '0');
  const [status, setStatus] = useState<EventStatus>(
    initialValues?.status ?? 'published'
  );

  const onCapacityChange = (value: string) =>
    setCapacity(normalizeNumericInput(value));

  const onPriceChange = (value: string) =>
    setPrice(normalizeNumericInput(value));

  const values = {
    title,
    description,
    host,
    categoryId,
    startsAt,
    endsAt,
    isOnline,
    city,
    venue,
    capacity,
    price,
    status
  };

  const onChange = {
    setTitle,
    setDescription,
    setHost,
    setCategoryId,
    setStartsAt,
    setEndsAt,
    setIsOnline,
    setCity,
    setVenue,
    onCapacityChange,
    onPriceChange,
    setStatus
  };
  //#endregion

  //#region validation
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const startUnchanged =
    initialValues !== undefined &&
    startsAt === toDateTimeInputValue(initialValues.startsAt);
  const endUnchanged =
    initialValues !== undefined &&
    endsAt === toDateTimeInputValue(initialValues.endsAt);
  const submittedStartsAt = initialValues && startUnchanged
    ? initialValues.startsAt
    : fromDateTimeInputValue(startsAt);
  const submittedEndsAt = initialValues && endUnchanged
    ? initialValues.endsAt
    : fromDateTimeInputValue(endsAt);
  const dateRangeError = validateDateRange(submittedStartsAt, submittedEndsAt);

  const rawFieldErrors = {
    title: validateEventTitle(title),
    description: validateEventDescription(description),
    host: validateEventHost(host),
    category: categoryId === 0 ? 'Category is required' : undefined,
    startsAt:
      startsAt === ''
        ? 'Start date is required'
        : startUnchanged ? undefined : validateStartDate(startsAt),
    endsAt: dateRangeError,
    city:
      !isOnline && city.trim().length === 0
        ? 'City is required'
        : !isOnline && city.trim().length > 100
        ? 'City must be at most 100 characters' : undefined,
    venue:
      !isOnline && venue.trim().length === 0
        ? 'Venue is required'
        : !isOnline && venue.trim().length > 255
        ? 'Venue must be at most 255 characters' : undefined,
    capacity:
      capacity === ''
        ? 'Capacity is required'
        : Number(capacity) <= 0
        ? 'Capacity must be greater than 0'
        : Number(capacity) < (initialValues?.registeredCount ?? 0)
        ? 'Capacity cannot be less than the number of registrations'
        : undefined,
    price:
      price === ''
        ? 'Price is required'
        : Number(price) < 0
        ? 'Price cannot be negative'
        : undefined
  };

  const isFormValid = Object.values(rawFieldErrors).every(
    error => error === undefined
  );

  const fieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : {
        title: undefined,
        description: undefined,
        host: undefined,
        category: undefined,
        startsAt: undefined,
        endsAt: undefined,
        city: undefined,
        venue: undefined,
        capacity: undefined,
        price: undefined,
        image: undefined
      };

  const validation = { isFormValid, fieldErrors };
  //#endregion

  //#region submission
  const isEditMode = Boolean(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addEvent, updateEvent } = useEvents();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const resetToInitial = () => {
    setTitle(initialValues?.title ?? '');
    setDescription(initialValues?.description ?? '');
    setHost(initialValues?.host ?? '');
    setCategoryId(initialValues?.categoryId ?? 0);
    setStartsAt(toDateTimeInputValue(initialValues?.startsAt || ''));
    setEndsAt(toDateTimeInputValue(initialValues?.endsAt || ''));
    setIsOnline(isInitialOnline);
    setCity(initialOfflineLocation?.city ?? '');
    setVenue(initialOfflineLocation?.venue ?? '');
    setCapacity(initialValues?.capacity?.toString() ?? '100');
    setPrice(initialValues?.price?.toString() ?? '0');
    setHasAttemptedSubmit(false);
    setStatus(initialValues?.status ?? 'draft');
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setHost('');
    setCategoryId(0);
    setStartsAt('');
    setEndsAt('');
    setCity('');
    setVenue('');
    setCapacity('100');
    setPrice('0');
    setHasAttemptedSubmit(false);
    setStatus('draft');
  };

  const secondaryAction = isEditMode ? resetToInitial : clearForm;
  const secondaryLabel = isEditMode ? 'Reset changes' : 'Clear form';

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    setIsSubmitting(true);

    const eventData: EventFormData = {
      title,
      description,
      host,
      categoryId,
      startsAt: submittedStartsAt,
      endsAt: submittedEndsAt,
      location: isOnline ? 'online' : { city, venue },
      capacity: Number(capacity),
      registeredCount: initialValues?.registeredCount || 0,
      price: Number(price),
      status
    };

    try {
      if (isEditMode && eventId) {
        await updateEvent(eventId, eventData);
        showToast('Event updated successfully!', 'success');
      } else {
        await addEvent(eventData);
        showToast('Event created successfully!', 'success');
      }

      navigate(isEditMode ? `/events/${eventId}` : '/events');
    } catch (err) {
      const message = getErrorMessage(err, 'Something went wrong. Try again.');
      setSubmitError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isSubmitting
    ? isEditMode
      ? 'Saving…'
      : 'Creating event…'
    : isEditMode
    ? 'Save changes'
    : 'Create event';

  const submission = {
    isSubmitting,
    submitError,
    clearForm,
    handleSubmit,
    submitLabel,
    secondaryAction,
    secondaryLabel,
    isEditMode
  };
  //#endregion

  return { values, onChange, validation, submission };
}
