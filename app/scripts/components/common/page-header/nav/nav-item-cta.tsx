import React from 'react';
import GoogleForm from '../../google-form';
import { ActionNavItem } from '../types';
import { useFeedbackModal } from '$utils/use-feedback-modal';

interface NavItemCTAProps {
  item: ActionNavItem;
  customClasses?: string;
}

export const NavItemCTA = ({ item, customClasses }: NavItemCTAProps) => {
  const { isRevealed, show, hide } = useFeedbackModal();
  return (
    <React.Fragment key={item.id}>
      {item.actionId === 'open-google-form' && (
        <>
          <button
            className={
              customClasses && customClasses != ''
                ? customClasses
                : 'usa-nav__link'
            }
            type='button'
            tabIndex={0}
            id={item.id}
            onClick={show}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {item.title}
          </button>
          <GoogleForm
            src={process.env.GOOGLE_FORM || ''}
            isRevealed={isRevealed}
            hide={hide}
          />
        </>
      )}
      {/* @TODO: Other possible cases would go here to perform some type of action */}
    </React.Fragment>
  );
};
