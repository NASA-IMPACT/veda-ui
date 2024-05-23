import React from 'react';
import { TourProvider } from '@reactour/tour';
import { DevTools } from 'jotai-devtools';
import { useAtom } from 'jotai';
import { PopoverTourComponent, TourManager } from './tour-manager';
import { timelineDatasetsAtom } from './atoms/datasets';
import ExplorationAndAnalysis from '.';
import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';

/**
 * @VEDA2-REFACTOR-WORK
 *
 * @NOTE: This container component serves as a wrapper for the purpose of data management, this is ONLY to support current instances.
 * veda2 instances can just use the direct component, 'ExplorationAndAnalysis', and manage data directly in their page views
 */

const tourProviderStyles = {
  popover: (base) => ({
    ...base,
    padding: '0',
    background: 'none'
  })
};

export default function ExplorationAndAnalysisContainer() {
  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);

  return (
    <TourProvider
      steps={[]}
      styles={tourProviderStyles}
      ContentComponent={PopoverTourComponent}
    >
      <DevTools />
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
      />
      <TourManager />
      <PageMainContent>
        <PageHero title='Exploration' isHidden />
        <ExplorationAndAnalysis datasets={datasets} setDatasets={setDatasets} />
      </PageMainContent>
    </TourProvider>
  );
}
