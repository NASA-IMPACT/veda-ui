import React from "react";
import { SiteAlert } from "@trussworks/react-uswds";
import './index.scss';

export default function Announcement() {
  return <SiteAlert slim variant='emergency'>Alert</SiteAlert>;
}

// return (<div className='usa-alert usa-alert--info usa-alert--no-icon'>
//   <div className='usa-alert__body'>
//     <p className='usa-alert__text'>
//       Lorem ipsum dolor sit amet,
//       <a className='usa-link' >consectetur adipiscing</a>
//       elit, sed do eiusmod.
//     </p>
//   </div>
//         </div>);