import React from 'react';
import styled, { css } from 'styled-components';
import { Transition, TransitionGroup } from 'react-transition-group';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const fadeDuration = 240;

interface MessageProps {
  show: boolean;
  isInvalid?: boolean;
}

const Message = styled.div<MessageProps>`
  position: absolute;
  left: 50%;
  z-index: 8;
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
          top: -${variableGlsp()};
          opacity: 0;
        `}
`;

interface MapMessageProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
  isInvalid?: boolean;
}

export default function MapMessage(props: MapMessageProps) {
  const { id, children, active, isInvalid } = props;

  return (
    <TransitionGroup component={null}>
      {active && (
        <Transition key={id} timeout={fadeDuration}>
          {(state) => {
            return (
              <Message
                show={state === 'entered' || state === 'entering'}
                isInvalid={isInvalid}
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
