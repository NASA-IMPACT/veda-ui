import React from 'react';
import {
  TextInput,
  TextInputMask,
  InputSuffix,
  InputGroup
} from '@trussworks/react-uswds';

export function USWDSTextInput(props) {
  return <TextInput {...props} />;
}

export function USWDSTextInputMask(props) {
  return <TextInputMask {...props} />;
}

export function USWDSInputSuffix(props) {
  return <InputSuffix {...props} />;
}

export function USWDSInputGroup(props) {
  return <InputGroup {...props} />;
}
