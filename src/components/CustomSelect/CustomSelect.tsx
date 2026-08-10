import { Label, Select } from 'radix-ui';
import { ChevronDown } from 'lucide-react';

import styles from './CustomSelect.module.scss';
export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  id: string;
  label?: string;
  placeholder?: string;
  value: T | '';
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  disabled?: boolean;
}

export const CustomSelect = <T extends string>({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled = false
}: CustomSelectProps<T>) => (
  <div className={styles.wrapper}>
    {label && (
      <Label.Root htmlFor={id} className={styles.label}>
        {label}
      </Label.Root>
    )}

    <Select.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger id={id} className={styles.trigger}>
        <Select.Value placeholder={placeholder} />

        <Select.Icon className={styles.triggerIcon}>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position='popper'
          sideOffset={4}
          className={styles.content}
        >
          <Select.Viewport className={styles.viewport}>
            {options.map(option => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={styles.item}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
);
