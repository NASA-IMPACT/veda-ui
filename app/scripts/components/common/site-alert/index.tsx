import React, { useState } from 'react';
import { Icon } from '@trussworks/react-uswds';
import { decode } from 'he';
import { USWDSSiteAlert } from '$uswds';

const ALERT_KEY = 'dismissedSiteAlertUrl';

function hasExpired(expiryDatetime?: Date): boolean {
  if (!expiryDatetime) return false;
  const expiryDate = new Date(expiryDatetime);
  const currentDate = new Date();
  return !!(currentDate > expiryDate);
}

enum SiteAlertType {
  info = 'info',
  emergency = 'emergency'
}

const infoTypeFlag = SiteAlertType.info;

interface SiteAlertProps {
  appTitle: string;
  expires?: Date;
  content: string;
  type?: SiteAlertType;
  heading?: string;
  showIcon?: boolean;
  slim?: boolean;
  className?: string;
}

export default function SiteAlert({
  appTitle,
  expires,
  content,
  type = infoTypeFlag,
  heading,
  showIcon = true,
  slim = false,
  className = ''
}: SiteAlertProps) {
  const showAlert = localStorage.getItem(ALERT_KEY) !== content;
  const [isOpen, setIsOpen] = useState(showAlert && !hasExpired(expires));

  function onClose() {
    localStorage.setItem(ALERT_KEY, content);
    setIsOpen(false);
  }

  return (
    <div>
      {isOpen && (
        <div className='position-relative'>
          <USWDSSiteAlert
            aria-label={`${appTitle} site alert`}
            variant={type}
            heading={heading}
            showIcon={showIcon}
            slim={slim}
            className={`${className} ${
              type !== infoTypeFlag ? 'bg-secondary-lighter' : ''
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: decode(content) }} />
          </USWDSSiteAlert>
          <div className='position-absolute top-0 right-0 margin-right-3 height-full display-flex'>
            <button
              className='usa-button usa-button--unstyled'
              type='button'
              aria-label={`Close ${appTitle} site alert`}
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
