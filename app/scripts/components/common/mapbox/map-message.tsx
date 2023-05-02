import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Transition, TransitionGroup } from 'react-transition-group';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const fadeDuration = 240;

interface MessageProps {
  show: boolean;
  isInvalid?: boolean;
  position?: 'left' | 'right' | 'center';
}

const Message = styled.div<MessageProps>`
  position: absolute;
  z-index: 2;
  transform: translate(-50%, 0);
  padding: ${glsp(0.5, 0.75)};
  box-shadow: ${themeVal('boxShadow.elevationA')};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: ${glsp(0.5)};

  ${({ position }) => {
    if (position === 'left') return 'left: 25%;';
    if (position === 'right') return 'left: 75%;';
    return 'left: 50%;';
  }}

  ${({ isInvalid }) =>
    isInvalid
      ? css`
          background: ${themeVal('color.danger')};
          color: ${themeVal('color.surface')};
        `
      : css`
          background: #fff;
        `}

  transition: all ${fadeDuration}ms ease-in-out;
  ${({ show }) =>
    show
      ? css`
          visibility: visible;
          top: ${variableGlsp()};
          opacity: 1;
        `
      : css`
          visibility: hidden;
          top: ${variableGlsp(-1)};
          opacity: 0;
        `}
`;

interface MapMessageProps extends Pick<MessageProps, 'isInvalid' | 'position'> {
  id: string;
  active: boolean;
  children: ReactNode;
}

export default function MapMessage(props: MapMessageProps) {
  const { id, children, active, isInvalid, position } = props;

  return (
    <TransitionGroup component={null}>
      {active && (
        <Transition key={id} timeout={fadeDuration}>
          {(state) => {
            return (
              <Message
                show={state === 'entered' || state === 'entering'}
                isInvalid={isInvalid}
                position={position}
              >
                {children}
              </Message>
            );
          }}
        </Transition>
      )}
    </TransitionGroup>
  );
}
