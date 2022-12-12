import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Feature } from 'geojson';
import { Modal, ModalFooter, ModalHeadline } from '@devseed-ui/modal';

import { Button } from '@devseed-ui/button';
import { themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import {
  CollecticonArrowUp,
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  CollecticonCircleExclamation,
  CollecticonCircleTick,
  CollecticonCircleInformation
} from '@devseed-ui/collecticons';
import useCustomAoI, { acceptExtensions } from './use-custom-aoi';
import { variableGlsp } from '$styles/variable-utils';

const UploadFileModalFooter = styled(ModalFooter)`
  display: flex;
  justify-content: right;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.25)};
`;

const UploadFileModalBody = styled.div`
  & > * {
    margin-bottom: 1rem;
  }
`;

const FileInput = styled.input`
  ${visuallyHidden()}
`;

const UploadSuccess = styled.div`
  color: ${themeVal('color.success')};
`;

const UploadWarnings = styled.div`
  color: ${themeVal('color.info')};
`;

const UploadError = styled.div`
  color: ${themeVal('color.danger')};
`;

interface AoIUploadModalProps {
  revealed: boolean;
  onCloseClick: () => void;
  setFeature: (feature: Feature) => void;
}

export default function AoIUploadModal({
  revealed,
  onCloseClick,
  setFeature
}: AoIUploadModalProps) {
  const { onUploadFile, uploadFileError, uploadFileWarnings, fileInfo, feature } =
    useCustomAoI();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const onConfirmClick = useCallback(() => {
    if (!feature) return;
    setFeature(feature);
    onCloseClick();
  }, [feature, setFeature, onCloseClick]);

  return (
    <Modal
      id='aoiUpload'
      size='small'
      revealed={revealed}
      onCloseClick={onCloseClick}
      renderHeadline={() => (
        <ModalHeadline>
          <h1>Upload custom area</h1>
        </ModalHeadline>
      )}
      content={
        <UploadFileModalBody>
          <div>
            You can upload a zippped shapefile (*.zip) or a GeoJSON file
            (*.json, *.geojson) to define a custom area of interest.
          </div>
          <div>
            <Button variation='primary-fill' onClick={onUploadClick}>
              <CollecticonArrowUp />
              Upload file...
            </Button>
            {fileInfo && <div>File: {fileInfo.name}, type: {fileInfo.type} (.{fileInfo.extension}) </div>}
            <FileInput
              type='file'
              onChange={onUploadFile}
              accept={acceptExtensions}
              ref={fileInputRef}
            />
          </div>
          {feature && (
            <UploadSuccess>
              <CollecticonCircleTick /> Succesfully uploaded file
            </UploadSuccess>
          )}
          {uploadFileWarnings.length > 0 && (
            <UploadWarnings>
              <CollecticonCircleInformation />{' '}
              {uploadFileWarnings.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </UploadWarnings>
          )}
          {uploadFileError && (
            <UploadError>
              <CollecticonCircleExclamation /> {uploadFileError}
            </UploadError>
          )}
        </UploadFileModalBody>
      }
      renderFooter={() => (
        <UploadFileModalFooter>
          <Button variation='base-fill' title='Cancel' onClick={onCloseClick}>
            <CollecticonXmarkSmall />
            Cancel
          </Button>
          <Button
            variation='primary-fill'
            title='Add this area'
            disabled={!feature}
            onClick={onConfirmClick}
          >
            <CollecticonTickSmall />
            Add this area
          </Button>
        </UploadFileModalFooter>
      )}
    />
  );
}
