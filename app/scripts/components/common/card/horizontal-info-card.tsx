import React from 'react';
import styled, { css } from 'styled-components';
import {
  glsp,
  themeVal,
} from '@devseed-ui/theme-provider';
import { CardTitle } from './styles';
import { variableBaseType } from '$styles/variable-utils';
import { Pill } from '$styles/pill';

const HorizontalCard = styled.div`
  display: flex;
  height: inherit;
`;

const CardImage = styled.div`
  min-width: 10rem;
  width: 10rem;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
`;

export const HorizontalCardStyles = css`
  height: 10rem;
  color: ${themeVal('color.base-800')};

  ${CardTitle} {
    font-size: ${variableBaseType('0.7rem')};
  }

  #description {
    font-size: ${variableBaseType('0.6rem')};
    height: 3rem;
    margin: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;

    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box; /* @TODO-SANDRA: Fix this, this is causing an issue */
    -webkit-line-clamp: 2; /* number of lines to show */
            line-clamp: 2;
  
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
  }

  #tags {
    display: flex;
    gap: ${glsp(0.5)};
  }
`;

interface Props {
  title: JSX.Element | string;
  description?: JSX.Element | string;
  imgSrc?: string;
  imgAlt?: string;
  tagLabels?: string[];
}

export default function HorizontalInfoCard(props: Props) {
    const {
    title,
    description,
    imgSrc,
    imgAlt,
    tagLabels,
  } = props;

  return (
    <HorizontalCard>
      <CardImage>
        <img src={imgSrc} alt={imgAlt} loading='lazy' />
      </CardImage>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <div id='description'>
          <p>{description}</p>
        </div>
        <div id='tags'>
          {
            tagLabels && (
              tagLabels.map((label) => (
                <Pill variation='primary' key={label}>
                  {label}
                </Pill>
              ))
            )
          }
        </div>
      </CardContent>
    </HorizontalCard>
  );
}