import React from 'react';
import { Link } from 'react-router-dom';
import { FeatureCollection, Polygon } from 'geojson';
import styled, { useTheme } from 'styled-components';
import bbox from '@turf/bbox';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { ButtonProps } from '@devseed-ui/button';
import { CollecticonClockBack } from '@devseed-ui/collecticons';

import { ToolbarIconButton } from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Subtitle } from '@devseed-ui/typography';

import useSavedSettings from './use-saved-settings';

import { resourceNotFound } from '$components/uhoh';
import { useThematicArea } from '$utils/thematics';
import { VarHeading } from '$styles/variable-components';
import { formatDateRange } from '$utils/date';
import ItemTruncateCount from '$components/common/item-truncate-count';

const PastAnalysesDropdown = styled(Dropdown)`
  max-width: 22rem;
`;

const PastAnalysesMenu = styled(DropMenu)`
  /* styled-component */
`;

const PastAnalysisItem = styled(DropMenuItem)`
  /* styled-component */
`;

const PastAnalysisMedia = styled.figure`
  position: relative;
  order: -1;
  height: 3rem;
  overflow: hidden;
  border-radius: ${themeVal('shape.rounded')};
  flex-shrink: 0;
  aspect-ratio: 1.5 / 1;
  background: ${themeVal('color.base-50')};

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    content: '';
    box-shadow: inset 0 0 0 1px ${themeVal('color.base-100a')};
    border-radius: ${themeVal('shape.rounded')};
    pointer-events: none;
  }
`;

const PastAnalysisHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};

  ${Subtitle} {
    font-weight: initial;
  }
`;

const PastAnalysisTitle = styled(VarHeading).attrs({
  as: 'h4',
  size: 'xxsmall'
})`
  /* styled-component */
`;

interface SavedAnalysisControlProps {
  size: ButtonProps['size'];
  urlBase: string;
}

export default function SavedAnalysisControl({
  size,
  urlBase
}: SavedAnalysisControlProps) {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const { thematicAreaSavedSettingsList } = useSavedSettings({
    thematicAreaId: thematic.data.id
  });

  return (
    <PastAnalysesDropdown
      alignment='right'
      triggerElement={(props) => (
        <ToolbarIconButton
          {...props}
          size={size}
          variation='achromic-outline'
          disabled={!thematicAreaSavedSettingsList.length}
        >
          <CollecticonClockBack title='Show past analyses' meaningful />
        </ToolbarIconButton>
      )}
    >
      <DropTitle>Past analyses</DropTitle>
      <PastAnalysesMenu as='ol'>
        {thematicAreaSavedSettingsList.map((savedSettings) => {
          const { start, end, aoi, datasets } = savedSettings.params;
          return (
            <li key={savedSettings.url}>
              <article>
                <PastAnalysisItem
                  as={Link}
                  to={`${urlBase}${savedSettings.url}`}
                  data-dropdown='click.close'
                >
                  <PastAnalysisHeadline>
                    <PastAnalysisTitle>
                      {formatDateRange(
                        new Date(start),
                        new Date(end),
                        ' — ',
                        false
                      )}
                    </PastAnalysisTitle>
                    <Subtitle>
                      <ItemTruncateCount items={datasets} />
                    </Subtitle>
                  </PastAnalysisHeadline>
                  <PastAnalysisMedia>
                    <SavedAnalysisThumbnail aoi={aoi} />
                  </PastAnalysisMedia>
                </PastAnalysisItem>
              </article>
            </li>
          );
        })}
      </PastAnalysesMenu>
    </PastAnalysesDropdown>
  );
}

function SavedAnalysisThumbnail(props: { aoi: FeatureCollection<Polygon> }) {
  const { aoi } = props;

  const theme = useTheme();

  const styledFeatures = {
    type: 'FeatureCollection',
    features: aoi.features.map(({ geometry }) => ({
      type: 'Feature',
      properties: {
        fill: theme.color?.primary,
        'stroke-width': 2,
        stroke: theme.color?.primary
      },
      geometry
    }))
  };

  let encodedGeoJson = encodeURIComponent(JSON.stringify(styledFeatures));
  const encodedGeoJsonChars = encodedGeoJson.length;

  // If more than 8000 chars the request will fail.
  // In this case simplify and show a bounding box.
  const MAX_MAPBOX_API_CHARS = 8000;
  if (encodedGeoJsonChars > MAX_MAPBOX_API_CHARS) {
    const [w, s, e, n] = bbox(styledFeatures);
    // We want the corners length to be 1/4 of the distance between
    // W & E / N & S
    const lonSide = (w * -1 + e) * 0.25;
    const latSide = (n * -1 + s) * 0.25;

    const makeCorner = (p1, p2, p3) => ({
      type: 'Feature',
      properties: {
        'stroke-width': 8,
        stroke: theme.color?.primary
      },
      geometry: {
        type: 'LineString',
        coordinates: [p1, p2, p3]
      }
    });

    const fc = {
      type: 'FeatureCollection',
      features: [
        makeCorner([w + lonSide, n], [w, n], [w, n + latSide]),
        makeCorner([e - lonSide, n], [e, n], [e, n + latSide]),
        makeCorner([e - lonSide, s], [e, s], [e, s - latSide]),
        makeCorner([w + lonSide, s], [w, s], [w, s - latSide])
      ]
    };

    encodedGeoJson = encodeURIComponent(JSON.stringify(fc));
  }

  const src = `https://api.mapbox.com/styles/v1/covid-nasa/cldac5c2c003k01oebmavw4q3/static/geojson(${encodedGeoJson})/auto/480x320?padding=32&access_token=${process.env.MAPBOX_TOKEN}`;

  return <img src={src} alt='Thumbnail showing AOI' />;
}
