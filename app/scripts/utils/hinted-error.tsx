import React, { Fragment, ReactNode } from 'react';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

export class HintedError extends Error {
  hints?: ReactNode[];

  constructor(message, hints: ReactNode[] = []) {
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

  pre {
    font-size: 0.875rem;
  }
`;

const ErrorSubtitle = styled.div`
  color: ${themeVal('color.base')};
  font-size: 0.875rem;
`;

interface HintedErrorDisplayProps {
  title: string;
  message: string;
  className?: string;
  hints?: ReactNode[];
  subtitle?: ReactNode;
  clearError?: ()=> void;
}

export function HintedErrorDisplay(props: HintedErrorDisplayProps) {
  const { className, hints, message, title, subtitle, clearError } = props;

  return (
    <ErrorBlock className={className}>
      <ErrorBlockInner>
        <div>
          <small>{title}</small>
          <strong>{message}</strong>
          {subtitle && <ErrorSubtitle>{subtitle}</ErrorSubtitle>}
          {!!hints?.length && (
            <ErrorHints>
              <p>
                <strong>Hints:</strong>
              </p>
              {hints.map((e, i) =>
                typeof e === 'string' ? (
                  /* eslint-disable-next-line react/no-array-index-key */
                  <p key={i}>{e}</p>
                ) : (
                  /* eslint-disable-next-line react/no-array-index-key */
                  <Fragment key={i}>{e}</Fragment>
                )
              )}
            </ErrorHints>
          )}
        </div>
      </ErrorBlockInner>
      <button onClick={clearError} type='button'> Rerender </button>
    </ErrorBlock>
  );
}

export const docsMessage = (
  <p>
    📜 Find all documentation in our{' '}
    <a
      href='https://github.com/NASA-IMPACT/veda-config/blob/main/docs/MDX_BLOCKS.md'
      target='_blank'
      rel='noreferrer nofollow'
    >
      <strong>Github repo</strong>
    </a>
    .
  </p>
);
