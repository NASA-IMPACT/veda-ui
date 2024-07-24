import React, {useState} from "react";
import { Banner as USWDSBanner, BannerContent, Icon } from "@trussworks/react-uswds";

const BANNER_KEY = 'dismissedBannerUrl';

function hasExpired(expiryDatetime) {
  const expiryDate = new Date(expiryDatetime);
  const currentDate = new Date();
  return !!(currentDate > expiryDate);
}

enum BannerType {
  info = 'info',
  warning ='warning'
}

const infoTypeFlag = BannerType.info;
interface BannerProps {
  appTitle: string,
  expires: Date,
  url: string,
  text: string,
  type?: BannerType
}

export default function Banner({appTitle, expires, url, text, type = infoTypeFlag }: BannerProps) {
  
  const showBanner = localStorage.getItem(BANNER_KEY) !== url;
  const [isOpen, setIsOpen] = useState(showBanner && !(hasExpired(expires)));

  function onClose () {
    localStorage.setItem(
      BANNER_KEY,
      url
    );
    setIsOpen(false);
  }

  return (
    <div>
      {isOpen && 
        (<div className='position-relative'>
          <USWDSBanner aria-label={appTitle} className={type !== infoTypeFlag? 'bg-secondary-lighter': ''}>
            <a href={url} target='_blank' rel='noreferrer'>
              <BannerContent className='padding-top-1 padding-bottom-1' isOpen={true}>
                <p dangerouslySetInnerHTML={{ __html: text }} />
              </BannerContent>
            </a>
          </USWDSBanner>
          <div className='position-absolute top-0 right-0 margin-right-3 height-full display-flex'>
              <button 
              className='usa-button usa-button--secondary usa-button--unstyled'
              type='button'
              aria-label='Close Banner'
              onClick={onClose}
              >
                <Icon.Close />
              </button>
          </div>
         </div>)}
    </div>
  );
}
