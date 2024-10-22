import React, { useState } from 'react';
import { Icon } from '@trussworks/react-uswds';
import {
  USWDSBanner,
  USWDSBannerContent
} from '$components/common/uswds/banner';

const BANNER_KEY = 'dismissedBannerUrl';

function hasExpired(expiryDatetime) {
  const expiryDate = new Date(expiryDatetime);
  const currentDate = new Date();
  return !!(currentDate > expiryDate);
}

enum BannerType {
  info = 'info',
  warning = 'warning'
}

const infoTypeFlag = BannerType.info;
interface BannerProps {
  appTitle: string;
  expires: Date;
  url: string;
  text: string;
  type?: BannerType;
}

export default function Banner({
  appTitle,
  expires,
  url,
  text,
  type = infoTypeFlag
}: BannerProps) {

  const showBanner = localStorage.getItem(BANNER_KEY) !== url;
  const [isOpen, setIsOpen] = useState(showBanner && !hasExpired(expires));

  function onClose() {
    localStorage.setItem(BANNER_KEY, url);
    setIsOpen(false);
  }

  return (
    <div>
      {isOpen && (
        <div className='position-relative'>
          <USWDSBanner
            aria-label={appTitle}
            className={type !== infoTypeFlag ? 'bg-secondary-lighter' : ''}
          >
            <a href={url} target='_blank' rel='noreferrer'>
              <USWDSBannerContent
                className='padding-top-1 padding-bottom-1'
                isOpen={true}
              >
                <div dangerouslySetInnerHTML={{ __html: text }} />

              </USWDSBannerContent>
            </a>
          </USWDSBanner>
          <div className='position-absolute top-0 right-0 margin-right-3 height-full display-flex'>
            <button
              className='usa-button usa-button--unstyled'
              type='button'
              aria-label='Close Banner'
              onClick={onClose}
            >
              <Icon.Close />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
