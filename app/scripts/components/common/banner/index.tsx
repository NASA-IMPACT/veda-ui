import React, { useState } from 'react';
import {
  USWDSBanner,
  USWDSBannerContent,
  USWDSBannerButton,
  USWDSBannerFlag,
  USWDSBannerHeader,
  USWDSBannerIcon,
  USWDSBannerGuidance,
  USWDSMediaBlockBody
} from '$uswds';
import { checkEnvFlag } from '$utils/utils';

interface Guidance {
  left?: GuidanceContent;
  right?: GuidanceContent;
}

interface GuidanceContent {
  icon?: string;
  iconAlt?: string;
  title?: string;
  text?: string;
}

interface BannerProps {
  headerText?: string;
  headerActionText?: string;
  ariaLabel?: string;
  flagImgAlt?: string;
  flagImgSrc?: string;
  leftGuidance?: GuidanceContent;
  rightGuidance?: GuidanceContent;
  className?: string;
  defaultIsOpen?: boolean;
  contentId?: string;
}

const DEFAULT_HEADER_TEXT =
  'An official website of the United States government';

const DEFAULT_HEADER_ACTION_TEXT = "Here's how you know";

const DEFAULT_FLAG_SRC = '/img/us_flag_small.png';

const DEFAULT_FLAG_ALT = 'U.S. flag';

const DEFAULT_GUIDANCE: Guidance = {
  left: {
    title: 'Official websites use .gov',
    text: 'A .gov website belongs to an official government organization in the United States.',
    iconAlt: 'Dot gov icon',
    icon: '/img/icon-dot-gov.svg'
  },
  right: {
    title: 'Secure .gov websites use HTTPS',
    text: `
        A <strong>lock</strong> or <strong>https://</strong> means you've safely
        connected to the .gov website. Share sensitive information only on
        official, secure websites.
      `,
    iconAlt: 'HTTPS icon',
    icon: '/img/icon-https.svg'
  }
};

const GuidanceBlock = ({
  content,
  className
}: {
  content: GuidanceContent;
  className?: string;
}) => (
  <USWDSBannerGuidance className={className}>
    <USWDSBannerIcon src={content.icon} alt={content.iconAlt ?? ''} />
    <USWDSMediaBlockBody>
      <p>
        <strong>{content.title}</strong>
        <br />
        <span dangerouslySetInnerHTML={{ __html: content.text ?? '' }} />
      </p>
    </USWDSMediaBlockBody>
  </USWDSBannerGuidance>
);

export default function Banner({
  headerText,
  headerActionText,
  ariaLabel,
  flagImgAlt = '',
  flagImgSrc,
  leftGuidance,
  rightGuidance,
  className = '',
  defaultIsOpen = false,
  contentId = 'gov-banner-content'
}: BannerProps) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const leftContent = {
    ...DEFAULT_GUIDANCE.left,
    ...leftGuidance
  } as GuidanceContent;
  const uswdsHeaderActive = checkEnvFlag(process.env.ENABLE_USWDS_PAGE_HEADER);
  const rightContent = {
    ...DEFAULT_GUIDANCE.right,
    ...rightGuidance
  } as GuidanceContent;

  return (
    <USWDSBanner
      aria-label={ariaLabel ?? DEFAULT_HEADER_TEXT}
      className={`${className} ${!uswdsHeaderActive && 'veda_one_padding'}`}
    >
      <USWDSBannerHeader
        isOpen={isOpen}
        flagImg={
          <USWDSBannerFlag
            src={flagImgSrc ?? DEFAULT_FLAG_SRC}
            alt={flagImgAlt ?? DEFAULT_FLAG_ALT}
          />
        }
        headerText={headerText ?? DEFAULT_HEADER_TEXT}
        headerActionText={headerActionText ?? DEFAULT_HEADER_ACTION_TEXT}
      >
        <USWDSBannerButton
          isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-controls={contentId}
        >
          {headerActionText ?? DEFAULT_HEADER_ACTION_TEXT}
        </USWDSBannerButton>
      </USWDSBannerHeader>

      <USWDSBannerContent id={contentId} isOpen={isOpen}>
        <div className='grid-row grid-gap-lg'>
          <GuidanceBlock content={leftContent} className='tablet:grid-col-6' />
          <GuidanceBlock content={rightContent} className='tablet:grid-col-6' />
        </div>
      </USWDSBannerContent>
    </USWDSBanner>
  );
}
