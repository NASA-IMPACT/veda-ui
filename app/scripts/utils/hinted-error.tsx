import React from 'react';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

export class HintedError extends Error {
  hints?: string[];

  constructor(message, hints = [] as string[]) {
    super(message);
    this.hints = hints;
  }
}

export const ErrorBlock = styled.div`
  margin: ${glsp(1, 0)};
  padding: ${glsp(0, 1)};
`;

export const ErrorBlockInner = styled.div`
  width: 100%;
  color: ${themeVal('color.danger')};
  border: 3px solid ${themeVal('color.danger')};
  padding: ${glsp(3)};

  > div {
    max-width: 48rem;
    margin: 0 auto;

    > * {
      display: block;
    }
  }
`;

export const ErrorHints = styled.div`
  margin-top: ${glsp()};
  color: ${themeVal('color.base')};
`;

interface HintedErrorDisplayProps {
  title: string;
  message: string;
  className?: string
  hints?: string[]
}

export function HintedErrorDisplay(props: HintedErrorDisplayProps) {
  const { className, hints, message, title } = props;

  return (
    <ErrorBlock className={className}>
      <ErrorBlockInner>
        <div>
          <small>{title}</small>
          <strong>{message}</strong>
          {!!hints?.length && (
            <ErrorHints>
              <p>Hints:</p>
              {hints.map((e, i) => (
                /* eslint-disable-next-line react/no-array-index-key */
                <p key={i}>{e}</p>
              ))}
            </ErrorHints>
          )}
        </div>
      </ErrorBlockInner>
    </ErrorBlock>
  );
}
