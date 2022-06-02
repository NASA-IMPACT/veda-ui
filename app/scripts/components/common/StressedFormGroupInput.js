import React from 'react';
import { PropTypes as T } from 'prop-types';

import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormInput,
  FormHelper
} from '@devseed-ui/form';

import StressedField from './StressedField';

/**
 * From group input structure implementing a stressed field.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {mixed} value Input value
 * @prop {string} inputType Type of input: number or text
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value.
 * @prop {function} validate Validation function callback. Must return boolean
 */
export default function StressedFormGroupInput(props) {
  const {
    id,
    name,
    label,
    value,
    validate,
    inputType,
    inputSize,
    inputVariation,
    placeholder,
    onChange,
    helper
  } = props;

  return (
    <FormGroup>
      <FormGroupHeader>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </FormGroupHeader>
      <FormGroupBody>
        <StressedField
          value={value}
          validate={validate}
          onChange={onChange}
          render={({ ref, errored, value, handlers }) => (
            <FormInput
              ref={ref}
              type={inputType}
              variation={inputVariation}
              name={name}
              id={id}
              invalid={errored}
              stressed={errored}
              size={inputSize}
              value={value}
              placeholder={placeholder}
              {...handlers}
            />
          )}
        />
        {helper && <FormHelper>{helper}</FormHelper>}
      </FormGroupBody>
    </FormGroup>
  );
}

StressedFormGroupInput.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  value: T.oneOfType([T.string, T.number]),
  inputType: T.oneOf(['number', 'text']),
  inputSize: T.string,
  inputVariation: T.string,
  placeholder: T.oneOfType([T.string, T.number]),
  validate: T.func,
  onChange: T.func,
  helper: T.node
};
