//#region imports
import type { FC } from 'react';
import { EventFormSection } from '../EventFormSection';
import { TextareaField } from '../TextareaField';
import type { EventStatus } from '../../../../../types/events';
import { FormField } from '../../../../ui/FormField';
import { useCategories } from '../../../../../contexts/CategoriesContext/useCategories';
import { CustomSelect } from '../../../../ui/CustomSelect';
import baseStyles from './base.module.scss';
//#endregion

interface EventDetailsValues {
  title: string;
  description: string;
  host: string;
  categoryId: number;
  status: EventStatus;
}

interface EventDetailsHandlers {
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHostChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (status: EventStatus) => void;
}

interface Props {
  values: EventDetailsValues;
  onChange: EventDetailsHandlers;
  errors: {
    title?: string;
    description?: string;
    category?: string;
    host?: string;
    image?: string;
  };
}

export const EventDetailsSection: FC<Props> = ({
  values,
  onChange,
  errors
}) => {
  const { categories, isLoading: categoriesLoading } = useCategories();

  return (
    <EventFormSection title='Event details'>
      <>
        <div className={baseStyles.fullWidth}>
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

        <div className={baseStyles.fullWidth}>
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

        <div className={baseStyles.fullWidth}>
          <FormField
            label='Host'
            id='host'
            value={values.host}
            onChange={e => onChange.onHostChange(e.target.value)}
            errorMessage={errors.host}
            placeholder='Your name or organization'
            required
          />
        </div>

        <CustomSelect<string>
          id='category-select'
          label='Category'
          value={values.categoryId ? values.categoryId.toString() : ''}
          onValueChange={onChange.onCategoryChange}
          options={categories.map(c => ({
            value: c.id.toString(),
            label: c.name
          }))}
          errorMessage={errors.category}
          disabled={categoriesLoading}
          placeholder='Select category'
        />

        <CustomSelect<EventStatus>
          id='status'
          label='Status'
          value={values.status}
          onValueChange={onChange.onStatusChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' }
          ]}
        />
      </>
    </EventFormSection>
  );
};
