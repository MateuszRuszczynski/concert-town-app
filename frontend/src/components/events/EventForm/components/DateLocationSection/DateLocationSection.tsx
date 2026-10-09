//#region imports
import type { FC } from 'react';
import { EventFormSection } from '../EventFormSection';

import baseStyles from './base.module.scss';
import { FormField } from '../../../../ui/FormField';
import { Checkbox } from '../../../../ui/Checkbox';
//#endregion

interface Values {
  startsAt: string;
  endsAt: string;
  isOnline: boolean;
  city: string;
  venue: string;
}

interface Handlers {
  onStartsAtChange: (value: string) => void;
  onEndsAtChange: (value: string) => void;
  onIsOnlineChange: (value: boolean) => void;
  onCityChange: (value: string) => void;
  onVenueChange: (value: string) => void;
}

interface Props {
  values: Values;
  onChange: Handlers;
  errors: {
    startsAt?: string;
    endsAt?: string;
    city?: string;
    venue?: string;
  };
}

export const DateLocationSection: FC<Props> = ({
  values,
  onChange,
  errors
}) => (
  <EventFormSection title='Date & location'>
    <>
      <FormField
        label='Starts'
        id='startsAt'
        type='datetime-local'
        value={values.startsAt}
        onChange={e => onChange.onStartsAtChange(e.target.value)}
        errorMessage={errors.startsAt}
        min={new Date().toISOString().slice(0, 16)}
        required
      />

      <FormField
        label='Ends'
        id='endsAt'
        type='datetime-local'
        value={values.endsAt}
        onChange={e => onChange.onEndsAtChange(e.target.value)}
        errorMessage={errors.endsAt}
        required
      />

      <div className={baseStyles.fullWidth}>
        <Checkbox
          id='isOnline'
          checked={values.isOnline}
          onChange={onChange.onIsOnlineChange}
          label='This is an online event'
        />
      </div>

      {!values.isOnline && (
        <>
          <FormField
            label='City / Location'
            id='city'
            value={values.city}
            onChange={e => onChange.onCityChange(e.target.value)}
            errorMessage={errors.city}
            placeholder='e.g. San Francisco, CA'
            required
          />

          <FormField
            label='Venue'
            id='venue'
            value={values.venue}
            onChange={e => onChange.onVenueChange(e.target.value)}
            errorMessage={errors.venue}
            placeholder='e.g. Moscone Center'
            required
          />
        </>
      )}
    </>
  </EventFormSection>
);
