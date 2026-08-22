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
import type {
  EventCategory,
  EventFormData,
  EventLocation
} from '../types/events';
import { useNotification } from '../contexts/NotificationContext';
import { normalizeNumericInput } from '../utils/normalizeNumericInput';
//#endregion

export function useEventForm (
  eventId: string | undefined,
  initialValues: EventFormData | undefined
) {
  //#region input controls
  const isInitialOnline = initialValues?.location === 'online';
  const initialOfflineLocation =
    initialValues?.location && initialValues.location !== 'online'
      ? initialValues.location
      : undefined;

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(
    initialValues?.description || ''
  );
  const [host, setHost] = useState(initialValues?.host || '');
  const [category, setCategory] = useState<EventCategory | ''>(
    initialValues?.category || 'conference'
  );
  const [startsAt, setStartsAt] = useState(initialValues?.startsAt || '');
  const [endsAt, setEndsAt] = useState(initialValues?.endsAt || '');
  const [isOnline, setIsOnline] = useState(isInitialOnline);
  const [city, setCity] = useState(initialOfflineLocation?.city ?? '');
  const [venue, setVenue] = useState(initialOfflineLocation?.venue ?? '');
  const [capacity, setCapacity] = useState(initialValues?.capacity || '100');
  const [price, setPrice] = useState(initialValues?.price || '0');

  const onCapacityChange = (value: string) =>
    setCapacity(normalizeNumericInput(value));

  const onPriceChange = (value: string) =>
    setPrice(normalizeNumericInput(value));

  const values = {
    title,
    description,
    host,
    category,
    startsAt,
    endsAt,
    isOnline,
    city,
    venue,
    capacity,
    price
  };

  const onChange = {
    setTitle,
    setDescription,
    setHost,
    setCategory,
    setStartsAt,
    setEndsAt,
    setIsOnline,
    setCity,
    setVenue,
    onCapacityChange,
    onPriceChange
  };
  //#endregion

  //#region validation
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const dateRangeError = validateDateRange(startsAt, endsAt);

  const rawFieldErrors = {
    title: validateEventTitle(title),
    description: validateEventDescription(description),
    host: validateEventHost(host),
    category: category === '' ? 'Please select a category' : undefined,
    startsAt:
      startsAt === '' ? 'Start date is required' : validateStartDate(startsAt),
    endsAt: endsAt === '' ? 'End date is required' : dateRangeError,
    city:
      !isOnline && city.trim().length === 0 ? 'City is required' : undefined,
    venue:
      !isOnline && venue.trim().length === 0 ? 'Venue is required' : undefined,
    capacity:
      capacity === ''
        ? 'Capacity is required'
        : Number(capacity) <= 0
        ? 'Capacity must be greater than 0'
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
        price: undefined
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
    setCategory(initialValues?.category ?? 'conference');
    setStartsAt(initialValues?.startsAt ?? '');
    setEndsAt(initialValues?.endsAt ?? '');
    setIsOnline(isInitialOnline);
    setCity(initialOfflineLocation?.city ?? '');
    setVenue(initialOfflineLocation?.venue ?? '');
    setCapacity(initialValues?.capacity?.toString() ?? '100');
    setPrice(initialValues?.price?.toString() ?? '0');
    setHasAttemptedSubmit(false);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setHost('');
    setCategory('conference');
    setStartsAt('');
    setEndsAt('');
    setIsOnline(false);
    setCity('');
    setVenue('');
    setCapacity('100');
    setPrice('0');
    setHasAttemptedSubmit(false);
  };

  const secondaryAction = isEditMode ? resetToInitial : clearForm;
  const secondaryLabel = isEditMode ? 'Reset changes' : 'Clear form';

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    setIsSubmitting(true);

    const location: EventLocation = isOnline ? 'online' : { city, venue };
    const eventData: EventFormData = {
      title,
      description,
      host,
      category: category as EventCategory,
      startsAt,
      endsAt,
      location,
      capacity: Number(capacity),
      price: Number(price)
    };

    try {
      if (isEditMode && eventId) {
        await Promise.all([updateEvent(eventId, eventData), wait(600)]);
        showToast('Event updated successfully!', 'success');
      } else {
        await Promise.all([addEvent(eventData), wait(600)]);
        showToast('Event created successfully!', 'success');
      }

      navigate(isEditMode ? `/events/${eventId}` : '/events');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Try again.';
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
