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

import tourComparisonUrl from '../../../graphics/content/tour-comparison.gif';
import tourAnalysisUrl from '../../../graphics/content/tour-analysis.gif';

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

const PopoverBody = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${glsp()};
`;

const PopoverFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${glsp()};
  font-weight: ${themeVal('type.base.bold')};
`;

export const introTourSteps = [
  {
    title: 'Time series analysis',
    selector: "[data-tour='analysis-tour']",
    content: () => (
      <>
        <img
          src={tourAnalysisUrl}
          alt='Animation showing an AOI being drawn through a mouse click'
        />

        <p>
          To calculate a time series of zonal statistics for your layers, start
          here by drawing or uploading your area of interest.
        </p>
      </>
    ),
    stepInteraction: false
  },
  {
    title: 'Comparison',
    selector: "[data-tour='compare-date']",
    content: () => (
      <>
        <img
          src={tourComparisonUrl}
          alt='Animation showing a comparison by dragging a slider across the map'
        />

        <p>
          Here you can compare two dates side-by-side.
        </p>
      </>
    )
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

const HIDE_TOUR_KEY = 'HIDE_TOUR';

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
  const hideTour = window.localStorage.getItem(HIDE_TOUR_KEY) === 'true';
  const [introTourShown, setIntroTourShown] = useState(false);

  // Variables that cause tour 1 to start.
  const datasets = useAtomValue(timelineDatasetsAtom);
  const datasetCount = datasets.length;
  const prevDatasetCount = usePreviousValue(datasetCount);
  useEffect(() => {
    // First time landing
    if (!hideTour && !introTourShown && !prevDatasetCount && datasetCount > 0) {
      // Make the last step of the intro tour mark it as shown.
      const steps = addActionAfterLastStep(introTourSteps, () => {
        setIntroTourShown(true);
      });
      startTour(steps);
    }
  }, [introTourShown, prevDatasetCount, datasetCount, startTour, setCurrentStep, setSteps, hideTour]);
  return null;
}

interface ExtendedPopoverContentProps extends PopoverContentProps {
  steps: (StepType & { title: string })[];
}

export function PopoverTourComponent(props: ExtendedPopoverContentProps) {
  const { currentStep, steps, setIsOpen, setCurrentStep } = props;

  const isLastStep = currentStep === steps.length - 1;
  const { content, title } = steps[currentStep];

  const closeTour = useCallback(() => {
    setIsOpen(false);
    window.localStorage.setItem(HIDE_TOUR_KEY, 'true');
  },[setIsOpen]);

  return (
    <Popover>
      <CloseButton
        variation='base-text'
        size='small'
        fitting='skinny'
        onClick={closeTour}
      >
        <CollecticonXmark size='small' meaningful title='Close feature tour' />
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
          <CollecticonChevronLeftSmall meaningful title='Previous feature' />
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
          <CollecticonChevronRightSmall meaningful title='Next feature' />
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
