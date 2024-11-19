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
          <a className='usa-nav__link' id={item.id}>
            <span onClick={show}>{item.title}</span>
          </a>
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
