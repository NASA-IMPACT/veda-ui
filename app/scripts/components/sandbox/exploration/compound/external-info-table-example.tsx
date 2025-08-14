import React from 'react';
import { Table } from '@trussworks/react-uswds';
import { useEACompoundState } from '$components/exploration/compound/hooks';
import { useTimelineDatasetVisibility } from '$components/exploration/atoms/hooks';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { TipButton } from '$components/common/tip-button';
import { USWDSIcon } from '$uswds';

/**
 * This is just a showcase example of the usage of the EACompoundState hook.
 */

const InfoViewExampleRow = (props: { dataset: TimelineDataset }) => {
  const { dataset } = props;
  const [isVisible, setVisible] = useTimelineDatasetVisibility(dataset.data.id);
  return (
    <tr key={dataset.data.id}>
      <th scope='row'>{dataset.data.name}</th>
      <td>{dataset.data.description}</td>
      <td>
        {' '}
        <TipButton
          tipContent={isVisible ? 'Hide layer' : 'Show layer'}
          size='small'
          fitting='skinny'
          onPointerDownCapture={(e) => e.stopPropagation()}
          onClick={() => setVisible((v) => !v)}
        >
          {isVisible ? <USWDSIcon.Visibility /> : <USWDSIcon.VisibilityOff />}
        </TipButton>
      </td>
    </tr>
  );
};
export default function InfoTableViewExample(props) {
  const { eaDatasets } = useEACompoundState(props.rawDatasets);
  const tableContent = eaDatasets.map((dataset) => {
    return <InfoViewExampleRow key={dataset.data.id} dataset={dataset} />;
  });

  return <Table bordered={false}>{tableContent}</Table>;
}
