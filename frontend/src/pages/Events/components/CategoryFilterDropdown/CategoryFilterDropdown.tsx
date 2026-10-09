//#region imports
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { FC } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useCategories } from '../../../../contexts/CategoriesContext/useCategories';
import styles from './CategoryFilterDropdown.module.scss';
//#endregion

interface Props {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryFilterDropdown: FC<Props> = ({ selected, onChange }) => {
  const { categories } = useCategories();

  const toggleCategory = (category: string, checked: boolean) => {
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
          {categories.map(c => (
            <DropdownMenu.CheckboxItem
              key={c.slug}
              checked={selected.includes(c.slug)}
              onCheckedChange={checked => toggleCategory(c.slug, checked)}
              className={styles.item}
              onSelect={e => e.preventDefault()}
            >
              <span className={styles.checkbox}>
                <DropdownMenu.ItemIndicator>
                  <Check size={12} aria-hidden='true' />
                </DropdownMenu.ItemIndicator>
              </span>
              {c.name}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
