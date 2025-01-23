import React from 'react';
import {
  Footer,
  FooterNav,
  SocialLink,
  Logo,
  Address,
  FooterExtendedNavList
} from '@trussworks/react-uswds';

export function USWDSFooter(props) {
  return <Footer {...props} />;
}
export function USWDSFooterNav(props) {
  return <FooterNav {...props} />;
}
export function USWDSSocialLink(props) {
  return <SocialLink {...props} />;
}
export function USWDSLogo(props) {
  return <Logo {...props} />;
}
export function USWDSAddress(props) {
  return <Address {...props} />;
}
export function USWDSFooterExtendedNavList(props) {
  return <FooterExtendedNavList {...props} />;
}
