import React, { useState } from 'react';
import { decode } from 'he';
import {
  USWDSBanner,
  USWDSBannerContent,
  USWDSBannerButton,
  USWDSBannerFlag,
  USWDSBannerHeader,
  USWDSBannerIcon,
  USWDSBannerGuidance,
  USWDSMediaBlockBody
} from '$components/common/uswds/banner';

interface GuidanceContent {
  icon: string;
  iconAlt?: string;
  title: string;
  text: string;
}

interface BannerProps {
  headerText?: string;
  headerActionText?: string;
  ariaLabel?: string;
  flagImgAlt?: string;
  leftGuidance?: GuidanceContent;
  rightGuidance?: GuidanceContent;
  className?: string;
  defaultIsOpen?: boolean;
  contentId?: string;
}

const defaultGuidance = {
  left: {
    title: 'Official websites use .gov',
    text: 'A .gov website belongs to an official government organization in the United States.',
    iconAlt: 'Dot gov icon',
    icon: '/img/icon-dot-gov.svg'
  },
  right: {
    title: 'Secure .gov websites use HTTPS',
    text: `<>
        A <strong>lock</strong> or <strong>https://</strong> means you've safely
        connected to the .gov website. Share sensitive information only on
        official, secure websites.
      </>`,
    iconAlt: 'HTTPS icon',
    icon: '/img/icon-https.svg'
  }
};

export default function GovBanner({
  headerText,
  headerActionText = "Here's how you know",
  ariaLabel,
  flagImgAlt = '',
  leftGuidance,
  rightGuidance,
  className = '',
  defaultIsOpen = false,
  contentId = 'gov-banner-content'
}: BannerProps) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const defaultHeaderText =
    'An official website of the United States government';

  const leftContent = {
    ...defaultGuidance.left,
    ...leftGuidance
  };

  const rightContent = {
    ...defaultGuidance.right,
    ...rightGuidance
  };

  return (
    <USWDSBanner
      aria-label={ariaLabel ?? defaultHeaderText}
      className={className}
    >
      <USWDSBannerHeader
        isOpen={isOpen}
        flagImg={
          <USWDSBannerFlag src='/img/us_flag_small.png' alt={flagImgAlt} />
        }
        headerText={headerText ?? defaultHeaderText}
        headerActionText={headerActionText}
      >
        <USWDSBannerButton
          isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-controls={contentId}
        >
          {headerActionText}
        </USWDSBannerButton>
      </USWDSBannerHeader>

      <USWDSBannerContent id={contentId} isOpen={isOpen}>
        <div className='grid-row grid-gap-lg'>
          <USWDSBannerGuidance className='tablet:grid-col-6'>
            <USWDSBannerIcon
              src={leftContent.icon}
              alt={leftContent.iconAlt || ''}
            />
            <USWDSMediaBlockBody>
              <p>
                <strong>{leftContent.title}</strong>
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: decode(leftContent.text)
                  }}
                />
              </p>
            </USWDSMediaBlockBody>
          </USWDSBannerGuidance>

          <USWDSBannerGuidance className='tablet:grid-col-6'>
            <USWDSBannerIcon
              src={rightContent.icon}
              alt={rightContent.iconAlt || ''}
            />
            <USWDSMediaBlockBody>
              <p>
                <strong>{rightContent.title}</strong>
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: decode(rightContent.text)
                  }}
                />
              </p>
            </USWDSMediaBlockBody>
          </USWDSBannerGuidance>
        </div>
      </USWDSBannerContent>
    </USWDSBanner>
  );
}
