import React, {useState} from "react";
import { Alert } from "@trussworks/react-uswds";
import './index.scss';

export default function Announcement(props) {
  const [isOpen, setIsOpen] = useState(true);
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vestibulum commodo libero quis bibendum. Ut in lobortis augue, vel ultricies ligula.";
  
  return (
    <div>
      {isOpen && 
        (<div className='position-relative'>
        <Alert type='error' headingLevel='h4' slim noIcon>

            {text}
        </Alert>
        <div className='position-absolute'>
            <button 
              className='usa-button usa-button--secondary usa-button--unstyled'
            type='button'
            onClick={(e) => {setIsOpen(false);}}
            >X
            </button>
        </div>
         </div>)}
    </div>
  );
}
