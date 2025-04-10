import React from 'react';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardMedia,
  CardFooter
} from '@trussworks/react-uswds';

export function USWDSCardComponent(props) {
  return <Card {...props} />;
}

export function USWDSCardBody(props) {
  return <CardBody {...props} />;
}

export function USWDSCardGroup(props) {
  return <CardGroup {...props} />;
}

export function USWDSCardHeader(props) {
  return <CardHeader {...props} />;
}

export function USWDSCardMedia(props) {
  return <CardMedia {...props} />;
}

export function USWDSCardFooter(props) {
  return <CardFooter {...props} />;
}
