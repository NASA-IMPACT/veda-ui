import React from 'react';
import styled from 'styled-components';
import { glsp, truncated } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall
} from '@devseed-ui/collecticons';
import { DatePicker, DropdownDatePickerProps } from '@devseed-ui/date-picker';
import { Heading } from '@devseed-ui/typography';

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

const HeadingButton = styled.button`
  appearance: none;
  max-width: 100%;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  transition: all 0.32s ease 0s;

  &:hover {
    opacity: 0.64;
  }

  svg {
    flex-shrink: 0;
  }

  > span {
    ${truncated()}
  }
`;

function getDatePickerView(timeDensity?: TimeDensity) {
  const view = {
    day: 'month',
    // If the data's time density is yearly only allow the user to select a year
    // by setting the picker to a decade view.
    month: 'year',
    // If the data's time density is monthly only allow the user to select a
    // month by setting the picker to a early view.
    year: 'decade'
  }[timeDensity || 'day'];

  return view as Exclude<DropdownDatePickerProps['view'], undefined>;
}

interface PanelDateWidgetProps {
  title: React.ReactNode;
  value: DropdownDatePickerProps['value'];
  onConfirm: DropdownDatePickerProps['onConfirm'];
  timeDensity?: TimeDensity;
  availableDates?: Date[] | null;
}

export function PanelDateWidget(props: PanelDateWidgetProps) {
  const { title, onConfirm, value, timeDensity, availableDates } = props;

  return (
    <PanelWidget>
      <PanelWidgetHeader>
        <PanelWidgetTitle>{title}</PanelWidgetTitle>
      </PanelWidgetHeader>
      <PanelWidgetBody>
        <WidgetItemHeader>
          <WidgetItemHGroup>
            <WidgetItemHeadline>
              <DatePicker
                id='date-picker'
                alignment='left'
                direction='down'
                view={getDatePickerView(timeDensity)}
                max={availableDates?.last}
                min={availableDates?.[0]}
                onConfirm={onConfirm}
                value={value}
                renderTriggerElement={(
                  { active, className, ...rest },
                  label
                ) => {
                  return (
                    <Heading as='h4' size='xsmall'>
                      <HeadingButton {...rest} as='button'>
                        <span>{label === 'Date' ? 'None' : label}</span>{' '}
                        {active ? (
                          <CollecticonChevronUpSmall />
                        ) : (
                          <CollecticonChevronDownSmall />
                        )}
                      </HeadingButton>
                    </Heading>
                  );
                }}
              />
            </WidgetItemHeadline>
          </WidgetItemHGroup>
        </WidgetItemHeader>
      </PanelWidgetBody>
    </PanelWidget>
  );
}
