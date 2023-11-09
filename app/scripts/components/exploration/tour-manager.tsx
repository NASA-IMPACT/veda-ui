import React, { useEffect } from 'react';
import { useTour, PopoverContentProps, StepType } from '@reactour/tour';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import {
  CollecticonChevronLeftSmall,
  CollecticonChevronRightSmall,
  CollecticonXmark
} from '@devseed-ui/collecticons';

import { timelineDatasetsAtom } from './atoms/datasets';

import { usePreviousValue } from '$utils/use-effect-previous';

const Popover = styled.div`
  position: relative;
  background: ${themeVal('color.surface')};
  padding: ${glsp(1, 2, 1, 2)};
  border-radius: ${themeVal('shape.rounded')};
  display: flex;
  flex-direction: column;
  gap: ${glsp()};
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: ${glsp(0.5)};
  top: ${glsp(0.5)};
`;

const PopoverBody = styled.div``;

const PopoverFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${glsp()};
  font-weight: ${themeVal('type.base.bold')};
`;

const tourSteps = [
  {
    title: 'Welcome to Exploration',
    selector: "[data-tour='dataset-list-item']",
    content:
      "Each timeline entry represents a dataset, and each of the gray segments represents a data unit in the dataset. This data unit can be a day, month or year, depending on the dataset's time density."
  },
  {
    title: 'Playhead',
    selector: "[data-tour='timeline-head-a']",
    content:
      'This is the main timeline playhead which can be used to select the date to view on the map. You can drag it around to change the date.'
  },
  {
    title: 'Date picker',
    selector: "[data-tour='date-picker-a']",
    content: 'Alternatively you can also select a date through the date picker.'
  },
  {
    title: 'Timeline',
    selector: "[data-tour='timeline-interaction-rect']",
    content: () => (
      <>
        To navigate the timeline you can zoom in by pressing the alt key (or
        option) + the scroll wheel, and click and drag to pan the timeline.
        <br />
        Clicking on the timeline will also move the playhead to that date.
        <br />
        Go ahead and try it out!
      </>
    )
  },
  {
    title: 'AOI tools',
    selector: '.mapboxgl-ctrl-top-left',
    content: () => (
      <>
        These tools allow you to draw or upload an AOI to run an analysis on the
        selected datasets.
      </>
    ),
    stepInteraction: false
  }
];

export function TourManager() {
  const { setIsOpen, setSteps } = useTour();
  const datasets = useAtomValue(timelineDatasetsAtom);

  const datasetCount = datasets.length;
  const prevDatasetCount = usePreviousValue(datasetCount);

  useEffect(() => {
    if (!prevDatasetCount && datasetCount > 0) {
      setSteps?.(tourSteps);
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, [prevDatasetCount, datasetCount, setIsOpen]);

  return null;
}

interface ExtendedPopoverContentProps extends PopoverContentProps {
  steps: (StepType & { title: string })[];
}

export function PopoverTourComponent(props: ExtendedPopoverContentProps) {
  const { currentStep, steps, setIsOpen, setCurrentStep } = props;

  const isLastStep = currentStep === steps.length - 1;
  const { content, title } = steps[currentStep];
  return (
    <Popover>
      <CloseButton
        variation='base-text'
        size='small'
        fitting='skinny'
        onClick={() => setIsOpen(false)}
      >
        <CollecticonXmark size='small' meaningful title='Close tour' />
      </CloseButton>
      <Heading as='strong' size='xsmall'>
        {title}
      </Heading>
      <PopoverBody>
        <>
          {/* Check if the step.content is a function or a string */}
          {typeof content === 'function' ? content({ ...props }) : content}
        </>
      </PopoverBody>
      <PopoverFooter>
        <Button
          variation='base-text'
          size='small'
          fitting='skinny'
          disabled={currentStep === 0}
          onClick={() => {
            setCurrentStep((s) => s - 1);
          }}
        >
          <CollecticonChevronLeftSmall meaningful title='Previous step' />
        </Button>
        <small>
          {currentStep + 1} / {steps.length}
        </small>
        <Button
          variation='base-text'
          size='small'
          fitting='skinny'
          disabled={isLastStep}
          onClick={() => {
            setCurrentStep((s) => s + 1);
          }}
        >
          <CollecticonChevronRightSmall meaningful title='Next step' />
        </Button>
      </PopoverFooter>
      {(currentStep === 0 || isLastStep) && (
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          Dismiss and do not show again
        </a>
      )}
    </Popover>
  );
}
