import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { Link } from 'react-router-dom';
import { CollecticonDatasetLayers } from '$components/common/icons/dataset-layers';
import { ParentDatset } from '$components/exploration/types.d.ts';
import { getDatasetPath } from '$utils/routes';

const DatasetLink = styled(Link)<{size: string}>`
  color: ${themeVal('color.link')};
  text-align: left;
  text-transform: none;
  font-size: ${(props => props.size=='small'? '0.75rem': '1rem')};
  line-height: 0.75rem;
  font-weight: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 0.1rem;
  > svg {
    fill: ${themeVal('color.link')};
  }
`;

export default function ParentDatasetLink(props: { parentDataset: ParentDatset, size: string}) {
  const { parentDataset, size } = props;
  const linkTo = getDatasetPath(parentDataset.id);
  return (
  <DatasetLink to={linkTo} size={size}>
    <CollecticonDatasetLayers /> {parentDataset.name}
  </DatasetLink>);
}