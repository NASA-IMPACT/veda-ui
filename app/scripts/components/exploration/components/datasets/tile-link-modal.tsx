import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { FormInput, FormGroupStructure, Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { Heading, Overline } from '@devseed-ui/typography';
import {
  CollecticonClipboard,
  CollecticonClipboardTick
} from '@devseed-ui/collecticons';
import { Modal, ModalHeadline } from '@devseed-ui/modal';
import { CopyField } from '$components/common/copy-field';

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

export function TileUrlModal(props: {
  datasetName: string;
  tileUrls?: Record<string, string>;
  revealed: boolean;
  onClose: () => void;
}) {
  const { datasetName, tileUrls, revealed, onClose } = props;

  return (
    <Modal
      id='modal'
      size='small'
      revealed={revealed}
      onCloseClick={onClose}
      onOverlayClick={onClose}
      closeButton
      renderHeadline={() => (
        <ModalHeadline>
          <Overline>Dataset: {datasetName}</Overline>
          <Heading size='small'>Use with GIS software</Heading>
        </ModalHeadline>
      )}
      content={
        <Form>
          {[
            { label: 'XYZ Tile URL', value: tileUrls?.xyzTileUrl },
            { label: 'WMTS Tile URL', value: tileUrls?.wmtsTileUrl }
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
