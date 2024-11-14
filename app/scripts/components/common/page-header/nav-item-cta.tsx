import React from 'react';
import GoogleForm from '../google-form';
import { useFeedbackModal } from '../layout-root';
import { NavItemType, ButtonNavItem, ActionNavItem } from './types';
import { USWDSButton } from '$components/common/uswds';

interface NavItemCTAButtonProps {
  item: ButtonNavItem;
}
interface NavItemCTAActionProps {
  item: ActionNavItem;
}

const mapActionNavItemId = (
  item: ActionNavItem | ButtonNavItem,
  isRevealed,
  show,
  hide
) => {
  switch (item.actionId) {
    // @TODO: what are the other cases?
    case 'open-google-form': {
      return (
        <>
          {item.type == NavItemType.BUTTON ? (
            <USWDSButton
              onClick={show}
              outline={true}
              type='button'
              size='small'
            >
              {item.title}
            </USWDSButton>
          ) : (
            <a className='usa-nav__link'>
              <span onClick={show}>{item.title}</span>
            </a>
          )}
          <GoogleForm
            src={process.env.GOOGLE_FORM || ''}
            isRevealed={isRevealed}
            hide={hide}
          />
        </>
      );
    }
    default: {
      return null;
    }
  }
};

export const NavItemCTAButton: React.FC<NavItemCTAButtonProps> = ({
  item
}): JSX.Element => {
  const { isRevealed, show, hide } = useFeedbackModal();
  return (
    <React.Fragment key={item.title}>
      {item.actionId === 'open-google-form' ? (
        mapActionNavItemId(item, isRevealed, show, hide)
      ) : (
        <USWDSButton
          onClick={() => {
            mapActionNavItemId(item, isRevealed, show, hide);
          }}
          outline={true}
          type='button'
          size='small'
        >
          {item.title}
        </USWDSButton>
      )}
    </React.Fragment>
  );
};

export const NavItemCTAAction: React.FC<NavItemCTAActionProps> = ({
  item
}): JSX.Element => {
  const { isRevealed, show, hide } = useFeedbackModal();
  return (
    <React.Fragment key={item.title}>
      {item.actionId === 'open-google-form' ? (
        mapActionNavItemId(item, isRevealed, show, hide)
      ) : (
        <a className='usa-nav__link'>
          <span
            onClick={() => mapActionNavItemId(item, isRevealed, show, hide)}
          >
            {item.title}
          </span>
        </a>
      )}
    </React.Fragment>
  );
};
