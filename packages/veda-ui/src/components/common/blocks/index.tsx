import React, {
  Children,
  Component,
  ReactElement,
  ReactNode,
  createElement
} from 'react';
import styled from 'styled-components';
import { media } from '@devseed-ui/theme-provider';

import { FigcaptionInner } from '../figure';
import {
  defaultBlockName,
  wideBlockName,
  fullBlockName,
  generalErrorMessage,
  blockTypeErrorMessage,
  contentTypeErrorMessage,
  figureDisplayName,
  proseDisplayName
} from './block-constant';
import ContentBlockFigure from './figure';
import { ContentBlock, ContentBlockProse } from '$styles/content-block';

import { variableGlsp } from '$styles/variable-utils';
import {
  HintedError,
  HintedErrorDisplay,
  docsMessage
} from '$utils/hinted-error';

export const ContentBlockPAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

export const ContentBlockPBeta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      column-count: 2;
    `}
  }
`;

export const ContentBlockFAlpha = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

export const ContentBlockFBeta = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
  }
`;

export const ContentBlockFGama = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: full-start / full-end;
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

export const ContentBlockPFAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}

    ${media.xlargeUp`
      grid-column:  content-start / content-6;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
    grid-row: 2;

    ${media.mediumUp`
      grid-column: content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column: content-7 / content-end;
      grid-row: 1;
    `}
  }
`;

export const ContentBlockPFBeta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column: content-7 / content-end;
    `}

    ${media.xlargeUp`
      grid-column: content-8 / content-end;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
    grid-row: 2;

    ${media.mediumUp`
      grid-column: content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-start / content-7;
      grid-row: 1;
    `}
  }
`;

export const ContentBlockPFGama = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column:  content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}

    ${media.xlargeUp`
      grid-column:  content-start / content-6;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / full-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: content-2 / full-end;
    `}

    ${media.mediumUp`
      grid-column: content-3 / full-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / full-end;
      grid-row: 1;
    `}
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

export const ContentBlockPFDelta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column:  content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-7 / content-end;
    `}

    ${media.xlargeUp`
      grid-column:  content-8 / content-end;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: full-start / content-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: full-start / content-4;
    `}

    ${media.mediumUp`
      grid-column: full-start / content-7;
    `}

    ${media.largeUp`
      grid-row: 1;
    `}
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

// This will result an object like below
// { defaultProse: ContentBlockPAlpha,
// wideProse: ContentBlockPBeta,
// defaultFigure; ContentBlockFAlpha,
// ...
// fullProseFigure: ContentBlockPFGama
// fullFigureProse: ContentBlockPFDelta }
const matchingBlocks = {
  [`${defaultBlockName}${proseDisplayName}`]: ContentBlockPAlpha,
  [`${wideBlockName}${proseDisplayName}`]: ContentBlockPBeta,
  [`${defaultBlockName}${figureDisplayName}`]: ContentBlockFAlpha,
  [`${wideBlockName}${figureDisplayName}`]: ContentBlockFBeta,
  [`${fullBlockName}${figureDisplayName}`]: ContentBlockFGama,
  [`${defaultBlockName}${proseDisplayName}${figureDisplayName}`]:
    ContentBlockPFAlpha,
  [`${defaultBlockName}${figureDisplayName}${proseDisplayName}`]:
    ContentBlockPFBeta,
  [`${fullBlockName}${proseDisplayName}${figureDisplayName}`]:
    ContentBlockPFGama,
  [`${fullBlockName}${figureDisplayName}${proseDisplayName}`]:
    ContentBlockPFDelta
};

interface BlockComponentProps {
  type?: string;
  children: ReactElement[];
}

export function BlockComponent(props: BlockComponentProps) {
  const { children, type } = props;

  // Concat block type name (default, wide, full)
  // and children component type name (Figure, Prose)
  // to return matching block type
  // ex. <Block type='wide'><Figure /></Block> will result in 'wideFigure'
  const typeName = type ? type : 'default';
  const childrenAsArray = Children.toArray(children);

  const childrenComponents: string[] = childrenAsArray.map(
    (e) => {
    // @ts-expect-error type may not exist depending on the node, but the error
    // will be caught and this won't break.
    const typeVal = e.type;
      // When children components are loaded as lazy component - and the component is not resolved yet
      if (typeVal?._payload && !!typeVal._payload?.value.length) {
        return typeVal._payload.value[typeVal._payload.value.length-1];
      // When children components are loaded as lazy component - and the component is resolved
      } else if (typeVal?._payload?.value?.displayName) {
        return typeVal._payload.value.displayName;
      } else {
        return typeVal?.displayName ?? 'undefined';
      }

    }
  );

  const childrenNames = childrenComponents.reduce(
    (acc, curr) => acc + curr,
    ''
  );

  if (![defaultBlockName, wideBlockName, fullBlockName].includes(typeName)) {
    throw new HintedError(`${blockTypeErrorMessage} '${typeName}'`, [
      `Supported block types: 'wide', 'full'`
    ]);
  }

  if (!matchingBlocks[`${typeName}${childrenNames}`]) {
    let hints = [
      'The only direct children that blocks can have are Figure and Prose.',
      'Example:',
      <pre key='block-1'>
        {`<Block>
  <Figure><Image/></Figure>
  <Prose>
    This is some text.
  </Prose>
</Block>
`}
      </pre>
    ];

    if (childrenComponents.filter((e) => e == 'Figure').length > 1) {
      hints = [
        ...hints,
        'Block cannot have more than one Figure. Try to wrap Figures with Blocks.',
        'Before:',
        <pre key='block-1'>
          {`<Block>
  <Figure><Image/></Figure>
  <Figure><Image/></Figure>
</Block>
`}
        </pre>,
        'After:',
        <pre key='block-2'>
          {`<Block>
  <Figure><Image/></Figure>
</Block>
<Block>
  <Figure><Image/></Figure>
</Block>
`}
        </pre>,
        '--',
        'If you want your image to be inline, you can drop the Figure and use the images inside a Prose.',
        'Before:',
        <pre key='block-3'>
          {`<Block>
  <Figure><Image/></Figure>
  <Figure><Image/></Figure>
</Block>
`}
        </pre>,
        'After:',
        <pre key='block-4'>
          {`<Block>
  <Prose>
    <Image/>
    Some more text...
  </Prose>
</Block>
`}
        </pre>
      ];
    }

    throw new HintedError(contentTypeErrorMessage, hints);
  }

  return createElement(matchingBlocks[`${typeName}${childrenNames}`], props);
}

interface BlockErrorBoundaryProps {
  childToRender: any;
  passErrorToChild?: boolean;
  className?: string;
  children?: ReactNode;
}

export class BlockErrorBoundary extends Component<
  BlockErrorBoundaryProps,
  { error: any }
> {
  static getDerivedStateFromError(error) {
    error.CRAOverlayIgnore = true;
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
    this.clearError = this.clearError.bind(this);
  }

  clearError() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { childToRender: Block, passErrorToChild, ...rest } = this.props;

    if (error && !passErrorToChild) {
      return (
        <HintedErrorDisplay
          title={generalErrorMessage}
          subtitle={docsMessage}
          message={error.message}
          className={rest.className}
          hints={error.hints}
        />
      );
    }

    return <Block error={error} clearError={this.clearError} {...rest} />;
  }
}

interface BlockWithErrorProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function BlockWithError(props: BlockWithErrorProps) {
  return <BlockErrorBoundary {...props} childToRender={BlockComponent} />;
}
