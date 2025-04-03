import React, { useRef, useEffect, useCallback, useMemo } from 'react';

import { Icon } from '@trussworks/react-uswds';
import { FilterActions } from '../utils';

import { USWDSSearch, USWDSButton } from '$uswds';

import { Taxonomy } from '$types/veda';

import CheckableFilters, {
  OptionItem
} from '$components/common/form/checkable-filter';
import './filter-controls.scss';

interface FiltersMenuProps {
  onAction: (action: FilterActions, value: any) => void;
  search?: string;
  taxonomiesOptions: Taxonomy[];
  allSelected: OptionItem[];
  clearedTagItem?: OptionItem;
  setClearedTagItem?: React.Dispatch<
    React.SetStateAction<OptionItem | undefined>
  >;

  onFilterChange?: (item: OptionItem, action: 'add' | 'remove') => void;
  exclusiveSourceSelected?: string | null;
  mobileFilterMenu: boolean;
  setMobileFilterMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    allSelected,
    onAction,
    taxonomiesOptions,
    search,
    onFilterChange,
    clearedTagItem,
    setClearedTagItem,
    exclusiveSourceSelected,
    // Custom top offset to customize the top position of the controls.
    // This is a specific case for the Catalog view when it's embedded in the modal which
    // has a different header reference as opposed to what the useSlidingStickyHeader hook
    // uses as a reference (the main page header). To avoid changing the reference IDs in the
    // main logic of the sliding sticky header hook, we provide this custom top offset for more control.
    mobileFilterMenu,
    setMobileFilterMenu
  } = props;

  const controlsRef = useRef<HTMLDivElement>(null);

  const handleChanges = useCallback(
    (item: OptionItem, action: 'add' | 'remove') => {
      const isSelected = allSelected.some(
        (selected) =>
          selected.id === item.id && selected.taxonomy === item.taxonomy
      );
      if (
        (action === 'remove' && isSelected) ||
        (action === 'add' && !isSelected)
      ) {
        onFilterChange?.(item, action);
      }
    },
    [allSelected, onFilterChange]
  );

  const taxonomiesItems = useMemo(
    () =>
      taxonomiesOptions.map((taxonomy) => ({
        title: taxonomy.name,
        items: taxonomy.values.map((value) => ({
          ...value,
          taxonomy: taxonomy.name
        }))
      })),
    [taxonomiesOptions]
  );

  useEffect(() => {
    // Pre-select the exclusive source if a card with it is selected
    if (exclusiveSourceSelected) {
      taxonomiesOptions.forEach((taxonomy) => {
        taxonomy.values.forEach((t) => {
          if (t.id === exclusiveSourceSelected) {
            handleChanges({ ...t, taxonomy: taxonomy.name }, 'add');
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exclusiveSourceSelected]);
  return (
    <div className=' tablet:z-auto z-500 wrapper margin-right-3 position-absolute tablet:position-relative'>
      <div
        id='dataset__search'
        ref={controlsRef}
        className={`tablet:display-block tablet:width-auto width-full overflow-x-hidden tablet:bg-none bg-white bottom-0 tablet:bottom-auto top-0 tablet:top-auto right-0 tablet:right-auto tablet:padding-05 padding-3 position-fixed tablet:position-relative ${
          mobileFilterMenu ? 'isVisible display-block' : 'display-none'
        }`}
      >
        <div className='tablet:display-none display-flex flex-justify padding-bottom-3'>
          <h1>Search and Filter</h1>
          <USWDSButton
            type='button'
            onClick={() => setMobileFilterMenu(false)}
            unstyled
            className='text-base tablet:margin-y-2px margin-left-2px margin-y-0'
          >
            <Icon.Close size={3} />
          </USWDSButton>
        </div>
        <USWDSSearch
          placeholder='Search by title, description'
          value={search ?? ''}
          onChange={(v) => onAction(FilterActions.SEARCH, v.target.value)}
          className='margin-bottom-3'
        />
        {taxonomiesItems.map(({ title, items }) => (
          <CheckableFilters
            key={title}
            items={items}
            title={title}
            onChanges={(item) => {
              handleChanges(
                item,
                allSelected.some((selected) => selected.id === item.id)
                  ? 'remove'
                  : 'add'
              );
            }}
            globallySelected={allSelected}
            tagItemCleared={{
              item: clearedTagItem,
              callback: setClearedTagItem
            }}
          />
        ))}
      </div>
    </div>
  );
}
