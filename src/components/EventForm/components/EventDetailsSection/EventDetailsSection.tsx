//#region imports
import { type FC } from 'react';
import type { EventCategory } from '../../../../types/events';
import { CustomSelect } from '../../../CustomSelect';
import { FormField } from '../../../FormField';
import { TextareaField } from '../../../TextareaField';
import { EventFormSection } from '../EventFormSection';
import { CATEGORIES_OPTIONS } from './categories';
import styles from './EventDetailsSection.module.scss';
//#endregion

interface EventDetailsValues {
  title: string;
  description: string;
  host: string;
  category: EventCategory | '';
}

interface EventDetailsHandlers {
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHostChange: (value: string) => void;
  onCategoryChange: (value: EventCategory) => void;
}

interface Props {
  values: EventDetailsValues;
  onChange: EventDetailsHandlers;
  errors: {
    title?: string;
    description?: string;
    host?: string;
    category?: string;
    image?: string;
  };
}

export const EventDetailsSection: FC<Props> = ({
  values,
  onChange,
  errors
}) => {
  return (
    <EventFormSection title='Event details'>
      <>
        <div className={styles.fullWidth}>
          <FormField
            label='Title'
            id='title'
            value={values.title}
            onChange={e => onChange.onTitleChange(e.target.value)}
            errorMessage={errors.title}
            placeholder='e.g. Frontend Summit 2026'
            required
          />
        </div>

        <div className={styles.fullWidth}>
          <TextareaField
            label='Description'
            id='description'
            value={values.description}
            onChange={e => onChange.onDescriptionChange(e.target.value)}
            rows={4}
            errorMessage={errors.description}
            placeholder='Tell attendees what to expect...'
            required
          />
        </div>

        <CustomSelect
          id='category-select'
          label='Category'
          value={values.category}
          onValueChange={onChange.onCategoryChange}
          options={CATEGORIES_OPTIONS}
        />

        <FormField
          label='Host'
          id='host'
          value={values.host}
          onChange={e => onChange.onHostChange(e.target.value)}
          errorMessage={errors.host}
          placeholder='Your name or organization'
          required
        />
      </>
    </EventFormSection>
  );
};
