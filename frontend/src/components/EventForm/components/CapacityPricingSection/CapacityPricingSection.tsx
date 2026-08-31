//#region imports
import type { FC } from "react";
import { EventFormSection } from "../EventFormSection";
import { FormField } from "../../../FormField";
//#endregion

interface Values {
  capacity: string;
  price: string;
}

interface Handlers {
  onCapacityChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}

interface Props {
  values: Values;
  onChange: Handlers;
  errors: {
    capacity?: string;
    price?: string;
  };
}

export const CapacityPricingSection: FC<Props> = ({
  values,
  onChange,
  errors
}) => (
  <EventFormSection title='Capacity & pricing'>
    <>
      <FormField
        label='Capacity'
        id='capacity'
        type='number'
        min={1}
        value={values.capacity}
        onChange={e => onChange.onCapacityChange(e.target.value)}
        errorMessage={errors.capacity}
        required
      />

      <FormField
        label='Ticket price (USD, 0 = free)'
        id='price'
        type='number'
        min={0}
        step={0.01}
        value={values.price}
        onChange={e => onChange.onPriceChange(e.target.value)}
        errorMessage={errors.price}
        required
      />
    </>
  </EventFormSection>
);
