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
  leftGuidance?: GuidanceContent;
  rightGuidance?: GuidanceContent;
  className?: string;
  defaultIsOpen?: boolean;
  contentId?: string;
}

const DEFAULT_HEADER_TEXT =
  'An official website of the United States government';

const DEFAULT_HEADER_ACTION_TEXT = "Here's how you know";

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
        <span
          dangerouslySetInnerHTML={{ __html: decode(content.text ?? '') }}
        />
      </p>
    </USWDSMediaBlockBody>
  </USWDSBannerGuidance>
);

export default function Banner({
  headerText,
  headerActionText,
  ariaLabel,
  flagImgAlt = '',
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

  const rightContent = {
    ...DEFAULT_GUIDANCE.right,
    ...rightGuidance
  } as GuidanceContent;

  return (
    <USWDSBanner
      aria-label={ariaLabel ?? DEFAULT_HEADER_TEXT}
      className={className}
    >
      <USWDSBannerHeader
        isOpen={isOpen}
        flagImg={
          <USWDSBannerFlag src='/img/us_flag_small.png' alt={flagImgAlt} />
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
