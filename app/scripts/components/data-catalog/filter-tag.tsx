import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';

interface FilterTagProps {
  title: string;
}

const Tag = styled.span`
  display: flex;
  width: fit-content;
  justify-content: center;
  background-color: ${themeVal('color.base-100')};
  margin: ${glsp(0.25)};

  button {
    background: none;
    border: none;
    outline: none;
    box-shadow: none;
  }
`;

export default function FilterTag(props: FilterTagProps) {
  const {title} = props;
  return (
    <Tag>
      {title}
      <button type="button">
        <CollecticonXmarkSmall />
      </button>
    </Tag>
  );
}