import React from 'react';
import styled, { css } from 'styled-components';
import { Transition, TransitionGroup } from 'react-transition-group';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const fadeDuration = 240;

interface MessageProps {
  show: boolean;
}

const Message = styled.div<MessageProps>`
  position: absolute;
  left: 50%;
  z-index: 8;
  transform: translate(-50%, 0);
  padding: ${glsp(0.5, 0.75)};
  background: #fff;
  box-shadow: ${themeVal('boxShadow.elevationA')};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: center;

  transition: all ${fadeDuration}ms ease-in-out;
  ${({ show }) =>
    show
      ? css`
          visibility: visible;
          top: 0.5rem;
          opacity: 1;
        `
      : css`
          visibility: hidden;
          top: -2rem;
          opacity: 0;
        `}
`;

interface MapMessageProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
}

export default function MapMessage(props: MapMessageProps) {
  const { id, children, active } = props;

  return (
    <TransitionGroup component={null}>
      {active && (
        <Transition key={id} timeout={fadeDuration}>
          {(state) => {
            return (
              <Message show={state === 'entered' || state === 'entering'}>
                {children}
              </Message>
            );
          }}
        </Transition>
      )}
    </TransitionGroup>
  );
}
