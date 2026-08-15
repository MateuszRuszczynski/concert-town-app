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
import type { EventCategory, EventLocation } from '../types/events';
import { useNotification } from '../contexts/NotificationContext';
//#endregion

export function useEventForm () {
  //#region input controls
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');
  const [category, setCategory] = useState<EventCategory | ''>('conference');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [price, setPrice] = useState('0');

  const onCapacityChange = (value: string) => {
    if (value.startsWith('0')) {
      setCapacity(value.slice(1));
      return;
    }

    setCapacity(value === '' ? '0' : value);
  };

  const onPriceChange = (value: string) => {
    if (value.startsWith('0')) {
      setPrice(value.slice(1));
      return;
    }

    setPrice(value === '' ? '0' : value);
  };

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addEvent } = useEvents();
  const { showToast } = useNotification();
  const navigate = useNavigate();

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

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    setIsSubmitting(true);

    const location: EventLocation = isOnline ? 'online' : { city, venue };

    try {
      await Promise.all([
        addEvent({
          title,
          description,
          host,
          category: category as EventCategory,
          startsAt,
          endsAt,
          location,
          capacity: Number(capacity),
          price: Number(price)
        }),
        wait(600)
      ]);

      showToast('Event created successfully!', 'success');
      navigate('/events');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submission = { isSubmitting, submitError, clearForm, handleSubmit };
  //#endregion

  return { values, onChange, validation, submission };
}
