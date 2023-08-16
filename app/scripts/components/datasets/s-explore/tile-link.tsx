import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { FormInput, FormGroupStructure } from '@devseed-ui/form';
import { Button, ButtonProps } from '@devseed-ui/button';
import { CollecticonMap } from '@devseed-ui/collecticons';
import { Modal } from '@devseed-ui/modal';
import { CopyField } from '$components/common/copy-field';
import { Tip } from '$components/common/tip';

export const FormInputSubmitWrapper = styled.div`
  display: flex;
  > * {
    height: 100%;
  }
  > input {
    flex-grow: 2;
    border-radius: ${themeVal('shape.rounded')} 0 0 ${themeVal('shape.rounded')};
  }
  > button {
    flex-grow: 1;
    border-radius: 0 ${themeVal('shape.rounded')} ${themeVal('shape.rounded')} 0;
  }
`;

export function TileModal(props: {
  layerData?: unknown;
  revealed: boolean;
  onClose: () => void;
}) {
  const { layerData, revealed, onClose } = props;

  return (
    <Modal
      id='modal'
      size='medium'
      title='Use this dataset with GIS software'
      revealed={revealed}
      onCloseClick={onClose}
      onOverlayClick={onClose}
      closeButton
      content={
        <>
          {[
            { label: 'XYZ Tile Url', value: layerData?.metadata?.xyzTileUrl },
            { label: 'WMTS Tile Url', value: layerData?.metadata?.wmtsTileUrl }
          ].map((tileUrl) => (
            <FormGroupStructure
              key={tileUrl.value}
              id={tileUrl.label}
              label={tileUrl.label}
            >
              <FormInputSubmitWrapper>
                <FormInput type='text' disabled={true} value={tileUrl.value} />
                <CopyField value={tileUrl.value}>
                  {({ ref, showCopiedMsg }) => {
                    return (
                      <Tip
                        content='Copied'
                        visible={showCopiedMsg && revealed}
                        placement='top'
                      >
                        <Button
                          ref={ref}
                          size='medium'
                          variation='primary-fill'
                        >
                          Copy
                        </Button>
                      </Tip>
                    );
                  }}
                </CopyField>
              </FormInputSubmitWrapper>
            </FormGroupStructure>
          ))}
        </>
      }
    />
  );
}

function TileUrlButtonSelf(props: NotebookConnectButtonProps) {
  const {
    className,
    compact = true,
    variation = 'primary-fill',
    size = 'medium',
    layerData,
    disabled
  } = props;

  const [revealed, setRevealed] = useState(false);
  const close = useCallback(() => setRevealed(false), []);

  return (
    <>
      <Button
        className={className}
        type='button'
        disabled={disabled}
        variation={variation}
        fitting='skinny'
        onClick={() => setRevealed(true)}
        size={size}
      >
        <CollecticonMap
          meaningful={compact}
          title={
            disabled
              ? 'Current data does not offer tile urls.'
              : 'Open tile url options.'
          }
        />
      </Button>
      <TileModal layerData={layerData} revealed={revealed} onClose={close} />
    </>
  );
}

const TileUrlButton = styled(TileUrlButtonSelf)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
export default TileUrlButton;
