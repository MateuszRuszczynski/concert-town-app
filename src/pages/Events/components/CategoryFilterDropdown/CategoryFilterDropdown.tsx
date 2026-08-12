//#region imports
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import type { FC } from 'react';
import type { EventCategory } from '../../../../types/events';
import { CATEGORIES_OPTIONS } from '../../../../components/EventForm/components/EventDetailsSection/categories';
import styles from './CategoryFilterDropdown.module.scss';
//#endregion

interface Props {
  selected: EventCategory[];
  onChange: (categories: EventCategory[]) => void;
}

export const CategoryFilterDropdown: FC<Props> = ({ selected, onChange }) => {
  const toggleCategory = (category: EventCategory, checked: boolean) => {
    onChange(
      checked ? [...selected, category] : selected.filter(c => c !== category)
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger}>
        Category{selected.length > 0 && ` (${selected.length})`}
        <ChevronDown size={16} className={styles.icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={4}>
          {CATEGORIES_OPTIONS.map(option => (
            <DropdownMenu.CheckboxItem
              key={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={checked => toggleCategory(option.value, checked)}
              className={styles.item}
              onSelect={e => e.preventDefault()} // не закривати dropdown після кожного вибору
            >
              <span className={styles.checkbox}>
                <DropdownMenu.ItemIndicator>
                  <Check size={12} aria-hidden='true' />
                </DropdownMenu.ItemIndicator>
              </span>
              {option.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
