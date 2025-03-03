import React from 'react';
import GoogleForm from '../../google-form';
import { ActionNavItem } from '../types';
import { useDisplay } from '$utils/use-display';

interface NavItemCTAProps {
  item: ActionNavItem;
}

export const NavItemCTA = ({ item }: NavItemCTAProps) => {
  const { isRevealed, show, hide } = useDisplay();
  const defaultClassName = 'usa-nav__link';

  return (
    <React.Fragment key={item.id}>
      {item.actionId === 'open-google-form' && (
        <>
          <button
            className={item.customClassNames || defaultClassName}
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
