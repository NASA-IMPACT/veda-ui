import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { FormInput, FormGroupStructure, Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { Heading, Overline } from '@devseed-ui/typography';
import {
  CollecticonClipboard,
  CollecticonClipboardTick,
  CollecticonShare
} from '@devseed-ui/collecticons';
import { Modal, ModalHeadline } from '@devseed-ui/modal';
import { CopyField } from '$components/common/copy-field';

const FormInputSubmitWrapper = styled.div`
  display: flex;

  > input {
    flex-grow: 1;
    border-radius: ${themeVal('shape.rounded')} 0 0 ${themeVal('shape.rounded')};
  }

  > button:not(:last-child) {
    border-radius: 0;
  }

  > button:last-child {
    border-radius: 0 ${themeVal('shape.rounded')} ${themeVal('shape.rounded')} 0;
  }
`;

export function TileUrlModal(props: {
  datasetName: string;
  tileUrls?: Record<string, string>;
  revealed: boolean;
  onClose: () => void;
  jupyterUrl?: string;
}) {
  const { datasetName, tileUrls, revealed, onClose, jupyterUrl } = props;

  const encodeTileUrl = (url: string) => {
    try {
      const [baseUrl, queryString] = url.split('?');

      if (!queryString) {
        return baseUrl;
      }

      const decodedParams = decodeURIComponent(queryString);
      const quotedParams = encodeURIComponent(decodedParams + '\n\n\n\n\n');

      return `${baseUrl}?${quotedParams}`;
    } catch (e) {
      return url;
    }
  };

  const generateQgisUrl = (tileUrl: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const siteTitle = document.title;
    const layerName = `${datasetName} at ${currentDate}`;
    const quotedTileUrl = encodeTileUrl(tileUrl);

    return `${jupyterUrl}/qgis/?action=add_xyz_tile_layer&url=${quotedTileUrl}&layer_name=${encodeURIComponent(
      layerName
    )}&project_name=${encodeURIComponent(siteTitle)}`;
  };

  const handleOpenInQgis = (tileUrl: string) => {
    window.open(generateQgisUrl(tileUrl), '_blank');
  };

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
            {
              label: 'XYZ Tile URL',
              value: tileUrls?.xyzTileUrl,
              canOpenInQgis: true
            },
            {
              label: 'WMTS Tile URL',
              value: tileUrls?.wmtsTileUrl,
              canOpenInQgis: false
            }
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
                        {tileUrl.canOpenInQgis && (
                          <Button
                            size='medium'
                            variation='primary-fill'
                            onClick={() => tileUrl.value && handleOpenInQgis(tileUrl.value)}
                          >
                            <CollecticonShare meaningful title='Open in QGIS' />
                          </Button>
                        )}
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
