import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import styled from 'styled-components';
import { Icon } from '@trussworks/react-uswds';
import { FilterActions } from '../utils';

import { USWDSSearch, USWDSButton } from '$uswds';

import { Taxonomy } from '$types/veda';

import CheckableFilters, {
  OptionItem
} from '$components/common/form/checkable-filter';
import {
  useSlidingStickyHeader,
  HEADER_TRANSITION_DURATION
} from '$utils/use-sliding-sticky-header';
import { usePathname } from '$utils/use-pathname';
import './filter-controls.scss';

const ControlsWrapper = styled.div<{
  widthValue?: string;
  heightValue?: string;
  topValue: string;
}>`
  min-width: 20rem;
  width: ${(props) => props.widthValue ?? '20rem'};
  position: sticky;
  top: calc(${(props) => props.topValue} + 1rem);
  height: ${(props) => props.heightValue};
  transition: top ${HEADER_TRANSITION_DURATION}ms ease-out;
`;

interface FiltersMenuProps {
  onAction: (action: FilterActions, value: any) => void;
  search?: string;
  taxonomiesOptions: Taxonomy[];
  allSelected: OptionItem[];
  clearedTagItem?: OptionItem;
  setClearedTagItem?: React.Dispatch<
    React.SetStateAction<OptionItem | undefined>
  >;
  width?: string;
  onFilterChange?: (item: OptionItem, action: 'add' | 'remove') => void;
  exclusiveSourceSelected?: string | null;
  customTopOffset?: number;
  openByDefault?: boolean;
  mobileFilterMenu: boolean;
  setMobileFilterMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    allSelected,
    onAction,
    taxonomiesOptions,
    search,
    width,
    onFilterChange,
    clearedTagItem,
    setClearedTagItem,
    exclusiveSourceSelected,
    openByDefault,
    // Custom top offset to customize the top position of the controls.
    // This is a specific case for the Catalog view when it's embedded in the modal which
    // has a different header reference as opposed to what the useSlidingStickyHeader hook
    // uses as a reference (the main page header). To avoid changing the reference IDs in the
    // main logic of the sliding sticky header hook, we provide this custom top offset for more control.
    customTopOffset = 0,
    mobileFilterMenu,
    setMobileFilterMenu
  } = props;

  const pathname = usePathname();

  const controlsRef = useRef<HTMLDivElement>(null);

  const [controlsHeight, setControlsHeight] = useState<number>(0);
  const { isHeaderHidden, wrapperHeight } = useSlidingStickyHeader(pathname);

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

  useEffect(() => {
    if (!controlsRef.current) return;

    const height = controlsRef.current.offsetHeight;
    setControlsHeight(height);
    // Observe the height change of controls (from accordion folding)
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.borderBoxSize.length > 0) {
        const borderBoxSize = entry.borderBoxSize[0];
        // blockSize: For boxes with a horizontal writing-mode, this is the vertical dimension
        setControlsHeight(borderBoxSize.blockSize);
      }
    });
    resizeObserver.observe(controlsRef.current);
    return () => resizeObserver.disconnect();
  }, [controlsRef]);

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
    <div className=' tablet:z-auto z-500 wrapper margin-right-3'>
      {/* Commenting out for now until direction is clarified on EA page implementation */}
      {/* <ControlsWrapper
        widthValue={width}
        heightValue={controlsHeight + 'px'}
        topValue={
          isHeaderHidden && wrapperHeight
            ? '0px'
            : `${wrapperHeight - customTopOffset}px`
        }
      > */}
      <div
        id='dataset__search'
        ref={controlsRef}
        className={` tablet:display-block tablet:width-auto width-full overflow-x-hidden tablet:bg-none bg-white bottom-0 tablet:bottom-auto top-0 tablet:top-auto right-0 tablet:right-auto tablet:padding-05 ${
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
          className='margin-bottom-3 '
        />
        {taxonomiesItems.map(({ title, items }) => (
          <CheckableFilters
            key={title}
            items={items}
            title={title}
            onChanges={(item) =>
              handleChanges(
                item,
                allSelected.some((selected) => selected.id === item.id)
                  ? 'remove'
                  : 'add'
              )
            }
            globallySelected={allSelected}
            tagItemCleared={{
              item: clearedTagItem,
              callback: setClearedTagItem
            }}
            openByDefault={openByDefault}
          />
        ))}
      </div>
      {/* </ControlsWrapper> */}
    </div>
  );
}
