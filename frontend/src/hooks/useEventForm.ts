//#region imports
import { useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router';
import {
  validateCapacity,
  validateDateRange,
  validateEventDescription,
  validateEventHost,
  validateEventTitle,
  validatePrice,
  validateStartDate
} from '../utils/validation/eventValidation';
import type { EventFormData, EventStatus } from '../types/events';
import { useNotification } from '../contexts/NotificationContext';
import { normalizeNumericInput } from '../utils/normalizeNumericInput';
import {
  fromDateTimeInputValue,
  toDateTimeInputValue
} from '../utils/date/dateTimeInputFormat';
import { getErrorMessage } from '../utils/getErrorMessage';
import { getChangedEventFields } from '../utils/getChangedEventFields';
import { areDateTimesEqual } from '../utils/date/areDateTimesEqual';
import {
  useCreateEvent,
  useUpdateEvent
} from '../api/queries/events/useEventMutations';
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
  const [capacity, setCapacity] = useState(initialValues?.capacity || '0');
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
    setStatus,
  };
  //#endregion

  //#region validation
  const isEditMode = Boolean(eventId);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const shouldValidateStart =
    !isEditMode || !areDateTimesEqual(initialValues?.startsAt || '', startsAt);
  const startDateError = shouldValidateStart
    ? validateStartDate(startsAt)
    : undefined;
  const dateRangeError = validateDateRange(startsAt, endsAt);

  const rawFieldErrors = {
    title: validateEventTitle(title),
    description: validateEventDescription(description),
    host: validateEventHost(host),
    category: categoryId === 0 ? 'Category is required' : undefined,
    startsAt: startsAt === '' ? 'Start date is required' : startDateError,
    endsAt: endsAt === '' ? 'End date is required' : dateRangeError,
    city:
      !isOnline && city.trim().length === 0 ? 'City is required' : undefined,
    venue:
      !isOnline && venue.trim().length === 0 ? 'Venue is required' : undefined,
    capacity:
      capacity === ''
        ? 'Capacity is required'
        : validateCapacity(Number(capacity)),
    price:
      price === ''
        ? 'Price is required'
        : validatePrice(Number(price)),
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
        price: undefined
      };

  const validation = { isFormValid, fieldErrors };
  //#endregion

  //#region submission
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const isSubmitting = addEvent.isPending || updateEvent.isPending;

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
    setCapacity(initialValues?.capacity ?? '0');
    setPrice(initialValues?.price ?? '0');
    setHasAttemptedSubmit(false);
    setStatus(initialValues?.status ?? 'published');
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setHost('');
    setCategoryId(0);
    setStartsAt('');
    setEndsAt('');
    setIsOnline(false);
    setCity('');
    setVenue('');
    setCapacity('0');
    setPrice('0');
    setHasAttemptedSubmit(false);
    setStatus('published');
  };

  const secondaryAction = isEditMode ? resetToInitial : clearForm;
  const secondaryLabel = isEditMode ? 'Reset changes' : 'Clear form';

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setSubmitError(null);

    if (!isFormValid) return;

    const eventData: EventFormData = {
      title,
      description,
      host,
      categoryId,
      startsAt: fromDateTimeInputValue(startsAt),
      endsAt: fromDateTimeInputValue(endsAt),
      location: isOnline ? 'online' : { city, venue },
      capacity: Number(capacity),
      price: price,
      status: isEditMode ? status : 'published',
    };

    try {
      if (isEditMode && initialValues && eventId) {
        const updatedData = getChangedEventFields(initialValues, eventData);

        if (Object.keys(updatedData).length === 0) {
          showToast('No changes were made.', 'info');
        } else {
          await updateEvent.mutateAsync({ id: eventId, changes: updatedData });
          showToast('Event updated successfully!', 'success');
        }
      } else {
        await addEvent.mutateAsync(eventData);
        showToast('Event created successfully!', 'success');
      }

      navigate(isEditMode ? `/events/${eventId}` : '/events');
    } catch (err) {
      const message = getErrorMessage(err, 'Something went wrong. Try again.');
      setSubmitError(message);
      showToast(message, 'error');
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
