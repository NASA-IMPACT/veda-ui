import React, { useMemo } from 'react';
import {
  CollecticonCalendar,
  CollecticonChevronLeftSmall,
  CollecticonChevronRightSmall
} from '@devseed-ui/collecticons';
import { DatePicker, DropdownDatePickerProps } from '@devseed-ui/date-picker';
import { Heading } from '@devseed-ui/typography';

import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { format } from 'date-fns';
import {
  PanelWidget,
  PanelWidgetBody,
  PanelWidgetHeader,
  PanelWidgetTitle,
  WidgetItemHeader,
  WidgetItemHeadline,
  WidgetItemHGroup
} from '$styles/panel';
import { TimeDensity } from '$context/layer-data';
import { mod } from '$utils/utils';
import DateSliderControl from '$components/common/dateslider';
import { prepareDateSliderData } from '$components/common/dateslider/utils';

function getDatePickerView(timeDensity?: TimeDensity) {
  const view = {
    day: 'month',
    // If the data's time density is yearly only allow the user to select a year
    // by setting the picker to a decade view.
    month: 'year',
    // If the data's time density is monthly only allow the user to select a
    // month by setting the picker to a early view.
    year: 'decade'
  }[timeDensity || 'month'];

  return view as Exclude<DropdownDatePickerProps['view'], undefined>;
}

interface PanelDateWidgetProps {
  title: React.ReactNode;
  value: DropdownDatePickerProps['value'];
  onConfirm: DropdownDatePickerProps['onConfirm'];
  timeDensity?: TimeDensity;
  availableDates?: Date[];
  isClearable?: boolean;
  children?: React.ReactNode;
}

const formatDate = (date: Date | null, view: string) => {
  if (!date) return 'Date';

  switch (view) {
    case 'decade':
      return format(date, 'yyyy');
    case 'year':
      return format(date, 'MMM yyyy');
    default:
      return format(date, 'MMM do, yyyy');
  }
};

export function PanelDateWidget(props: PanelDateWidgetProps) {
  const {
    title,
    onConfirm,
    value,
    timeDensity,
    availableDates,
    isClearable,
    children
  } = props;

  const currIndex =
    availableDates?.findIndex((d) => d.getTime() === value.start?.getTime()) ??
    -1;

  const dateSliderDates = useMemo(
    () =>
      availableDates && timeDensity
        ? prepareDateSliderData(availableDates, timeDensity)
        : null,
    [availableDates, timeDensity]
  );

  return (
    <PanelWidget>
      <PanelWidgetHeader>
        <PanelWidgetTitle>{title}</PanelWidgetTitle>
      </PanelWidgetHeader>
      <PanelWidgetBody>
        <WidgetItemHeader>
          <WidgetItemHGroup>
            <WidgetItemHeadline>
              <Heading as='h4' size='xsmall'>
                {formatDate(value.start, getDatePickerView(timeDensity))}
              </Heading>
            </WidgetItemHeadline>
            {!!availableDates && (
              <Toolbar size='small'>
                <React.Fragment>
                  <ToolbarIconButton
                    disabled={currIndex <= 0}
                    onClick={() => {
                      const p =
                        availableDates[
                          mod(currIndex - 1, availableDates.length)
                        ];
                      onConfirm({ start: p, end: p });
                    }}
                  >
                    <CollecticonChevronLeftSmall />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    disabled={
                      currIndex < 0 || currIndex >= availableDates.length - 1
                    }
                    onClick={() => {
                      const n =
                        availableDates[
                          mod(currIndex + 1, availableDates.length)
                        ];
                      onConfirm({ start: n, end: n });
                    }}
                  >
                    <CollecticonChevronRightSmall />
                  </ToolbarIconButton>
                  <VerticalDivider />
                  <DatePicker
                    id='date-picker'
                    alignment='left'
                    direction='down'
                    view={getDatePickerView(timeDensity)}
                    max={availableDates.last}
                    min={availableDates[0]}
                    datesToRestrict={availableDates}
                    restrictMode='enable'
                    onConfirm={onConfirm}
                    isClearable={isClearable}
                    value={value}
                    renderTriggerElement={(props) => {
                      return (
                        <ToolbarIconButton
                          {...props}
                          disabled={availableDates.length == 1}
                        >
                          <CollecticonCalendar />
                        </ToolbarIconButton>
                      );
                    }}
                  />
                </React.Fragment>
              </Toolbar>
            )}
          </WidgetItemHGroup>
          {dateSliderDates && timeDensity && (
            <DateSliderControl
              data={dateSliderDates}
              value={value.start || undefined}
              timeDensity={timeDensity}
              onChange={({ date }) => onConfirm({ start: date, end: date })}
            />
          )}
          {children}
        </WidgetItemHeader>
      </PanelWidgetBody>
    </PanelWidget>
  );
}
