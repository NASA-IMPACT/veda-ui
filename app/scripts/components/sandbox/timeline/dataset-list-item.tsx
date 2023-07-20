import React, { useMemo, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import {
  addDays,
  isWithinInterval,
  subDays,
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  areIntervalsOverlapping
} from 'date-fns';
import {
  CollecticonEye,
  CollecticonEyeDisabled,
  CollecticonGripVertical
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';
import { LayerGradientGraphic } from '$components/common/mapbox/layer-legend';

function getBlockBoundaries(date, timeDensity) {
  switch (timeDensity) {
    case 'month':
      return [startOfMonth(date), endOfMonth(date)];
    case 'year':
      return [startOfYear(date), endOfYear(date)];
  }

  return [startOfDay(date), endOfDay(date)];
}

const DatasetItem = styled.article`
  width: 100%;
  display: flex;
  position: relative;

  ::before,
  ::after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    background: ${themeVal('color.base-200')};
    height: 1px;
  }

  ::before {
    top: 0;
  }

  ::after {
    bottom: -1px;
  }
`;

const DatasetHeader = styled.header`
  width: 20rem;
  flex-shrink: 0;
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')};
  background: ${themeVal('color.surface')};
  padding: ${glsp(0.5)};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${CollecticonGripVertical} {
    cursor: grab;
    color: ${themeVal('color.base-300')};

    &:active {
      cursor: grabbing;
    }
  }
`;

const DatasetInfo = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
`;

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${glsp()};
`;

const DatasetData = styled.div`
  padding: ${glsp(0.25, 0)};
  display: flex;
  align-items: center;
`;

const DatasetSvg = styled.svg``;

export function DatasetListItem(props: any) {
  const { dataset, width, xScaled, selectedDay } = props;

  const [isVisible, setVisible] = useState(true);

  const controls = useDragControls();

  return (
    <Reorder.Item value={dataset} dragListener={false} dragControls={controls}>
      <DatasetItem>
        <DatasetHeader>
          <CollecticonGripVertical onPointerDown={(e) => controls.start(e)} />
          <DatasetInfo>
            <DatasetHeadline>
              <Heading as='h3' size='xsmall'>
                {dataset.title}
              </Heading>
              <Toolbar size='small'>
                <ToolbarIconButton onClick={() => setVisible((v) => !v)}>
                  {isVisible ? (
                    <CollecticonEye
                      meaningful
                      title='Toggle dataset visibility'
                    />
                  ) : (
                    <CollecticonEyeDisabled
                      meaningful
                      title='Toggle dataset visibility'
                    />
                  )}
                </ToolbarIconButton>
              </Toolbar>
            </DatasetHeadline>
            <LayerGradientGraphic
              type='gradient'
              stops={['#eb7d2e', '#35a145', '#3287d2']}
              unit={{ label: 'bananas' }}
              min={-3}
              max={15}
            />
          </DatasetInfo>
        </DatasetHeader>
        <DatasetData>
          <DatasetTrack
            width={width}
            xScaled={xScaled}
            dataset={dataset}
            selectedDay={selectedDay}
            isVisible={isVisible}
          />
        </DatasetData>
      </DatasetItem>
    </Reorder.Item>
  );
}

const datasetTrackBlockHeight = 16;
function DatasetTrack(props: any) {
  const { width, xScaled, dataset, selectedDay, isVisible } = props;

  // Limit the items to render to increase performance.
  const domainToRender = useMemo(() => {
    const domain = xScaled.domain();
    const start = subDays(domain[0], 1);
    const end = addDays(domain[1], 1);

    return dataset.domain.filter((d) => {
      const [blockStart, blockEnd] = getBlockBoundaries(d, dataset.timeDensity);

      return areIntervalsOverlapping(
        {
          start: blockStart,
          end: blockEnd
        },
        { start, end }
      );
    });
  }, [xScaled, dataset]);

  return (
    <DatasetSvg width={width} height={datasetTrackBlockHeight}>
      {domainToRender.map((date) => (
        <DatasetTrackBlock
          key={date}
          xScaled={xScaled}
          date={date}
          dataset={dataset}
          selectedDay={selectedDay}
          isVisible={isVisible}
        />
      ))}
    </DatasetSvg>
  );
}

function DatasetTrackBlock(props: any) {
  const { xScaled, date, dataset, isVisible } = props;

  const [start, end] = getBlockBoundaries(date, dataset.timeDensity);
  const s = xScaled(start);
  const e = xScaled(end);

  const fill = useFillColors(isVisible);

  return (
    <React.Fragment key={date.getTime()}>
      <rect
        fill={fill}
        y={0}
        height={datasetTrackBlockHeight}
        x={s}
        width={e - s}
        rx={4}
      />
    </React.Fragment>
  );
}

const useFillColors = (isVisible: boolean): string | undefined => {
  const theme = useTheme();

  if (!isVisible) {
    return theme.color?.['base-200'];
  }

  return theme.color?.['base-400'];
};
