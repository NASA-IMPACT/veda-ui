import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Modal, ModalHeadline, ModalFooter } from '@devseed-ui/modal';
import { Heading, Subtitle } from '@devseed-ui/typography';

import { Button } from '@devseed-ui/button';
import {
  glsp,
  listReset,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { Icon } from '@trussworks/react-uswds';
import useCustomAoI, { acceptExtensions } from '../hooks/use-custom-aoi';
import { variableGlsp, variableProseVSpace } from '$styles/variable-utils';

const UploadFileModalFooter = styled(ModalFooter)`
  display: flex;
  justify-content: right;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.25)};
`;

const ModalBodyInner = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
`;

const UploadFileIntro = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableProseVSpace()};
`;

const FileUpload = styled.div`
  display: flex;
  flex-flow: nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};

  ${Button} {
    flex-shrink: 0;
  }

  ${Subtitle} {
    overflow-wrap: anywhere;
  }
`;

const FileInput = styled.input`
  ${visuallyHidden()}
`;

const UploadInformation = styled.div`
  padding: ${variableGlsp()};
  background: ${themeVal('color.base-50')};
  box-shadow: ${themeVal('boxShadow.inset')};
  border-radius: ${themeVal('shape.rounded')};
`;

const UploadListInfo = styled.ul`
  ${listReset()}
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};

  li {
    display: flex;
    flex-flow: row nowrap;
    gap: ${glsp(0.5)};
    align-items: top;

    > svg {
      flex-shrink: 0;
      margin-top: ${glsp(0.25)};
    }
  }
`;

const UploadInfoItemSuccess = styled.li`
  color: ${themeVal('color.success')};
`;

const UploadInfoItemWarnings = styled.li`
  color: ${themeVal('color.info')};
`;

const UploadInfoItemError = styled.li`
  color: ${themeVal('color.danger')};
`;

interface CustomAoIModalProps {
  revealed: boolean;
  onCloseClick: () => void;
  onConfirm: (features: Feature<Polygon>[]) => void;
}

export default function CustomAoIModal({
  revealed,
  onCloseClick,
  onConfirm
}: CustomAoIModalProps) {
  const {
    features,
    onUploadFile,
    uploadFileError,
    uploadFileWarnings,
    fileInfo,
    reset
  } = useCustomAoI();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const onConfirmClick = useCallback(() => {
    if (!features) return;
    onConfirm(features);
    onCloseClick();
  }, [features, onConfirm, onCloseClick]);

  useEffect(() => {
    if (revealed) reset();
  }, [revealed, reset]);

  const hasInfo = !!uploadFileWarnings.length || !!features || uploadFileError;

  return (
    <Modal
      id='aoiUpload'
      size='medium'
      revealed={revealed}
      onCloseClick={onCloseClick}
      renderHeadline={() => (
        <ModalHeadline>
          <h2>Upload custom area</h2>
        </ModalHeadline>
      )}
      content={
        <ModalBodyInner>
          <UploadFileIntro>
            <p>
              You can upload a zipped shapefile (*.zip) or a GeoJSON file
              (*.json, *.geojson) to define a custom area of interest.
            </p>
            <FileUpload>
              <Button variation='base-outline' onClick={onUploadClick}>
                <Icon.ArrowUpward size={3} />
                Upload file...
              </Button>
              {fileInfo && (
                <Subtitle as='p'>
                  File: {fileInfo.name} ({fileInfo.type}).
                </Subtitle>
              )}
              <FileInput
                type='file'
                onChange={onUploadFile}
                accept={acceptExtensions}
                ref={fileInputRef}
              />
            </FileUpload>
          </UploadFileIntro>

          {hasInfo && (
            <UploadInformation>
              <Heading hidden>Upload information</Heading>

              <UploadListInfo>
                {uploadFileWarnings.map((w) => (
                  <UploadInfoItemWarnings key={w}>
                    <Icon.Info size={3} />
                    <span>{w}</span>
                  </UploadInfoItemWarnings>
                ))}
                {features && (
                  <UploadInfoItemSuccess>
                    <Icon.CheckCircle size={3} />
                    <span>File uploaded successfully.</span>
                  </UploadInfoItemSuccess>
                )}
                {uploadFileError && (
                  <UploadInfoItemError>
                    <Icon.Error size={3} /> {uploadFileError}
                  </UploadInfoItemError>
                )}
              </UploadListInfo>
            </UploadInformation>
          )}
        </ModalBodyInner>
      }
      renderFooter={() => (
        <UploadFileModalFooter>
          <Button variation='base-text' onClick={onCloseClick}>
            <Icon.Close size={3} />
            Cancel
          </Button>
          <Button
            variation='primary-fill'
            disabled={!features}
            onClick={onConfirmClick}
          >
            <Icon.Check size={3} />
            Add area
          </Button>
        </UploadFileModalFooter>
      )}
    />
  );
}
