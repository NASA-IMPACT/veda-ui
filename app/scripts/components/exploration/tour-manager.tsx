import React, { useCallback, useEffect, useState } from 'react';
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
import useAois from '$components/common/map/controls/hooks/use-aois';

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

const introTourSteps = [
  {
    title: 'Map layer selection',
    selector: "[data-tour='dataset-list-item']",
    mutationObservables: ["[data-tour='dataset-list-item']"],
    content:
      "Each row represents a dataset, and each of the boxes on the timeline represents a data unit: day, month or year, depending on the dataset's time density."
  },
  {
    title: 'Playhead',
    selector: "[data-tour='timeline-head-a']",
    content:
      'Move this playhead to select a date to view on the map. You can drag it around or click on the timeline to place it.'
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
        You can zoom in on the timeline by scrolling while pressing the alt key
        (or option) and click and drag to pan.
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
        You can calculate a time series of zonal statistics for your area of
        interest (AOI). Start that process here by drawing or uploading an AOI.
      </>
    ),
    stepInteraction: false
  }
];

const analysisTourSteps = [
  {
    title: 'Analysis',
    selector: "[data-tour='analysis-message']",
    content: () => (
      <>
        You can now calculate a time series of zonal
        statistics for your area of interest.
      </>
    ),
    stepInteraction: false
  },
  {
    title: 'Date Range',
    selector: "[data-tour='analysis-toolbar']",
    content: () => (
      <>
        Refine the date range to analyze with the data pickers 
        or handles on the timeline.
        <br />
        Once you&apos;re happy, press the analyze button to start the calculation.
      </>
    ),
    stepInteraction: false
  }
];

/**
 * Helper function to add an action after the last step of a tour.
 * @param steps The steps to add the action to
 * @param action The action to add to the last step
 * @returns steps with the action added to the last step
 */
function addActionAfterLastStep(steps: StepType[], action: () => void) {
  const lastStep = steps[steps.length - 1];
  const lastStepWithAction = {
    ...lastStep,
    actionAfter: action
  };
  return [...steps.slice(0, -1), lastStepWithAction];
}

export function TourManager() {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const startTour = useCallback(
    (steps) => {
      setCurrentStep(0);
      setSteps?.(steps);
      setIsOpen(true);
    },
    [setIsOpen, setSteps, setCurrentStep]
  );

  // Control states for the different tours.
  const [introTourShown, setIntroTourShown] = useState(false);
  const [analysisTourShown, setAnalysisTourShown] = useState(false);

  // Variables that cause tour 1 to start.
  const datasets = useAtomValue(timelineDatasetsAtom);
  const datasetCount = datasets.length;
  const prevDatasetCount = usePreviousValue(datasetCount);
  useEffect(() => {
    if (!introTourShown && !prevDatasetCount && datasetCount > 0) {
      // Make the last step of the intro tour mark it as shown.
      const steps = addActionAfterLastStep(introTourSteps, () => {
        setIntroTourShown(true);
      });
      startTour(steps);
    }
  }, [introTourShown, prevDatasetCount, datasetCount, startTour]);

  // Variables that cause tour 2 to start.
  const { features } = useAois();
  const featuresCount = features.length;
  useEffect(() => {
    if (introTourShown && !analysisTourShown && featuresCount > 0) {
      // Make the last step of the intro tour mark it as shown.
      const steps = addActionAfterLastStep(analysisTourSteps, () => {
        setAnalysisTourShown(true);
      });
      startTour(steps);
    }
  }, [introTourShown, analysisTourShown, featuresCount, startTour]);

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
      {/* {(currentStep === 0 || isLastStep) && (
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          Dismiss and do not show again
        </a>
      )} */}
    </Popover>
  );
}
