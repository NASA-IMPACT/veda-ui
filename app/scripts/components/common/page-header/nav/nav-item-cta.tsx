import React from 'react';
import GoogleForm from '../../google-form';
import { useFeedbackModal } from '../../layout-root';
import { ActionNavItem } from '../types';

interface NavItemCTAProps {
  item: ActionNavItem;
}

export const NavItemCTA: React.FC<NavItemCTAProps> = ({
  item
}): JSX.Element => {
  const { isRevealed, show, hide } = useFeedbackModal();
  return (
    <React.Fragment key={item.id}>
      {item.actionId === 'open-google-form' && (
        <>
          <button
            className='usa-nav__link'
            type='button'
            tabIndex={0}
            id={item.id}
            onClick={show}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
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
