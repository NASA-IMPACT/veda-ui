import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { FormInput, FormGroupStructure, Form } from '@devseed-ui/form';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonClipboard,
  CollecticonClipboardTick,
  CollecticonMap
} from '@devseed-ui/collecticons';
import { Modal } from '@devseed-ui/modal';
import { CopyField } from '$components/common/copy-field';
import { ExtendedLayer } from '$components/common/mapbox/layers/styles';
import { Tip } from '$components/common/tip';
import { composeVisuallyDisabled } from '$utils/utils';

const FormInputSubmitWrapper = styled.div`
  display: flex;

  > input {
    flex-grow: 1;
    border-radius: ${themeVal('shape.rounded')} 0 0 ${themeVal('shape.rounded')};
  }

  > button {
    border-radius: 0 ${themeVal('shape.rounded')} ${themeVal('shape.rounded')} 0;
  }
`;

function TileModal(props: {
  layerData?: ExtendedLayer;
  revealed: boolean;
  onClose: () => void;
}) {
  const { layerData, revealed, onClose } = props;

  return (
    <Modal
      id='modal'
      size='small'
      title='Use this dataset with GIS software'
      revealed={revealed}
      onCloseClick={onClose}
      onOverlayClick={onClose}
      closeButton
      content={
        <Form>
          {[
            { label: 'XYZ Tile Url', value: layerData?.metadata?.xyzTileUrl },
            { label: 'WMTS Tile Url', value: layerData?.metadata?.wmtsTileUrl }
          ].map((tileUrl) =>
            tileUrl.value ? (
              <FormGroupStructure
                key={tileUrl.value}
                id={tileUrl.label}
                label={tileUrl.label}
              >
                <CopyField value={tileUrl.value}>
                  {({ ref, showCopiedMsg }) => {
                    return (
                      <FormInputSubmitWrapper>
                        <FormInput
                          type='text'
                          readOnly
                          value={showCopiedMsg ? 'Copied!' : tileUrl.value}
                        />
                        <Button
                          ref={ref}
                          size='medium'
                          variation='primary-fill'
                        >
                          {showCopiedMsg ? (
                            <CollecticonClipboardTick
                              meaningful
                              title={`${tileUrl.label} was copied`}
                            />
                          ) : (
                            <CollecticonClipboard
                              meaningful
                              title={`Copy ${tileUrl.label}`}
                            />
                          )}
                        </Button>
                      </FormInputSubmitWrapper>
                    );
                  }}
                </CopyField>
              </FormGroupStructure>
            ) : null
          )}
        </Form>
      }
    />
  );
}

const TileModalTriggerButton = composeVisuallyDisabled(Button);

interface TileUrlButtonProps extends ButtonProps {
  className?: string;
  layerData?: ExtendedLayer;
}

function TileUrlButtonSelf(props: TileUrlButtonProps) {
  const {
    className,
    variation = 'primary-fill',
    size = 'medium',
    layerData,
    disabled
  } = props;

  const [revealed, setRevealed] = useState(false);
  const close = useCallback(() => setRevealed(false), []);

  return (
    <>
      <Tip
        disabled={!disabled}
        content='Current dataset does not offer tile urls'
        placement='left'
      >
        <TileModalTriggerButton
          visuallyDisabled={disabled}
          className={className}
          type='button'
          variation={variation}
          fitting='skinny'
          onClick={() => setRevealed(true)}
          size={size}
        >
          <CollecticonMap meaningful title='Open tile url options' />
        </TileModalTriggerButton>
      </Tip>
      <TileModal layerData={layerData} revealed={revealed} onClose={close} />
    </>
  );
}

const TileUrlButton = styled(TileUrlButtonSelf)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
export default TileUrlButton;
