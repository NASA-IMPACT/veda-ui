import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { useTour } from '@reactour/tour';
import { Icon } from '@trussworks/react-uswds';

import { SelectorButton } from '$components/common/map/style/button';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';
import { introTourSteps } from '$components/exploration/tour-manager';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';

export function TourButtonComponent({
  onClick,
  disabled
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}) {
  return (
    <SelectorButton
      tipContent='Open guided tour'
      tipProps={{ placement: 'left' }}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon.HelpOutline size={3} />
    </SelectorButton>
  );
}

export function ShowTourControl() {
  const { setIsOpen, setCurrentStep, setSteps } = useTour();
  const datasets = useAtomValue(timelineDatasetsAtom);
  const disabled = datasets.length === 0;
  const reopenTour = useCallback(() => {
    setCurrentStep(0);
    setSteps?.(introTourSteps);
    setIsOpen(true);
  }, [setIsOpen, setCurrentStep, setSteps]);

  const control = useThemedControl(
    () => <TourButtonComponent onClick={reopenTour} disabled={disabled} />,
    {
      position: 'top-right'
    }
  );
  return control;
}
