import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import React, { useMemo } from 'react';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { sticky } from 'tippy.js';
import { DatasetLayer } from 'delta/thematics';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { analysisParams2QueryString } from '../results/use-analysis-params';
import { resourceNotFound } from '$components/uhoh';
import { thematicAnalysisPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import { Tip } from '$components/common/tip';

// Hack needed because tippy doesn't work on disabled elements
export const DisabledButtonWrapper = styled.div`
  pointer-events: none;
  opacity: .5;
`;

interface PageHeroActionsProps {
  size: string;
  isNewAnalysis: boolean;
  showTip: Boolean;
  start?: Date;
  end?: Date;
  datasetsLayers?: DatasetLayer[];
  aoi?: Feature<Polygon> | null;
}

export default function PageHeroActions({
  size,
  isNewAnalysis,
  showTip,
  start,
  end,
  datasetsLayers,
  aoi
}: PageHeroActionsProps) {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();
  const analysisParamsQs = useMemo(() => {
    if (!start || !end || !datasetsLayers || !aoi) return '';
    // Quick and dirty conversion to MultiPolygon - might be avoided if using Google-polyline?
    const toMultiPolygon: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: { ...aoi.properties },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [aoi.geometry.coordinates]
      }
    };
    return analysisParams2QueryString({
      start,
      end,
      datasetsLayers,
      aoi: toMultiPolygon
    });
  }, [start, end, datasetsLayers, aoi]);

  let tipContents;
  if (showTip) {
    tipContents = 'To get results, ';
    let instructions: string[] = [];
    if (!start || !end)
      instructions = [...instructions, 'pick start and end dates'];
    if (!aoi) instructions = [...instructions, 'define an area'];
    if (!datasetsLayers?.length) instructions = [...instructions, 'select datasets'];

    const instructionsString = instructions
      .join(', ')
      .replace(/,\s([^,]+)$/, ' and $1.');

    tipContents = [tipContents, instructionsString].join('');
  }

  return (
    <>
      {!isNewAnalysis && (
        <Button
          forwardedAs={Link}
          to={`${thematicAnalysisPath(thematic)}/results${location.search}`}
          type='button'
          size={size}
          variation='achromic-outline'
        >
          <CollecticonXmarkSmall /> Cancel
        </Button>
      )}
      {showTip ? (
        <Tip
          visible
          placement='bottom-end'
          content={tipContents}
          sticky='reference'
          plugins={[sticky]}
        ><DisabledButtonWrapper>
          <Button
            type='button'
            size={size}
            variation='achromic-outline'
            disabled
          >
            <CollecticonTickSmall /> Save
          </Button>
         </DisabledButtonWrapper>
        </Tip>
      ) : (
        <Button
          forwardedAs={Link}
          type='button'
          size={size}
          variation='achromic-outline'
          to={`${thematicAnalysisPath(thematic)}/results${analysisParamsQs}`}
        >
          <CollecticonTickSmall /> Save
        </Button>
      )}
    </>
  );
}
