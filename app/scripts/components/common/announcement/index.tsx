import React, {useState} from "react";
import { Banner, BannerContent, Icon } from "@trussworks/react-uswds";
import SmartLink from '$components/common/smart-link';
import './index.scss';

const BANNER_KEY = 'dismissedBannerUrl';

function hasExpired(expiryDatetime) {
  const expiryDate = new Date(expiryDatetime);
  const currentDate = new Date();
  return !!(currentDate > expiryDate);
}

export default function Announcement({expiryDate, actionUrl, contents}) {
  
  const showBanner = (localStorage.getItem(BANNER_KEY) !== actionUrl);
  const [isOpen, setIsOpen] = useState(showBanner && !(hasExpired(expiryDate)));

  function onClose () {
    localStorage.setItem(
      BANNER_KEY,
      actionUrl
    );
    setIsOpen(false);
  }
  console.log(showBanner);
  return (
    <div>
      {isOpen && 
        (<div className='position-relative'>
      <Banner aria-label='Official website of the state department of something specific'>
        <SmartLink to={actionUrl} target='_blank'>
          <BannerContent className='padding-top-1 padding-bottom-1' isOpen={true}>
            <p dangerouslySetInnerHTML={{__html: contents}} />
          </BannerContent>
        </SmartLink>
      </Banner>
        <div className='position-absolute margin-right-3'>
            <button 
              className='usa-button usa-button--secondary usa-button--unstyled'
            type='button'
            onClick={onClose}
            >
              <Icon.Close />
            </button>
        </div>
         </div>)}
    </div>
  );
}
