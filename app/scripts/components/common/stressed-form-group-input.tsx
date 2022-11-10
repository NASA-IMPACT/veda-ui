import React from 'react';
import {
  FormInput,
  FormGroupStructure,
  formSkinStylesProps
} from '@devseed-ui/form';

import StressedField from './stressed-field';

interface StressedFormGroupInputProps {
  id: string;
  name: string;
  label: string;
  value: number | string;
  inputType: 'number' | 'text';
  inputSize?: formSkinStylesProps['size'];
  placeholder?: number | string;
  validate: (value: string) => boolean;
  onChange: (draftValue: string, setDraftValue: React.Dispatch<string>) => void;
  helper?: JSX.Element | null;
  hideHeader: boolean;
}

/**
 * From group input structure implementing a stressed field.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {mixed} value Input value
 * @prop {boolean} hideHeader Whether or not to hide the header
 * @prop {string} inputType Type of input: number or text
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value.
 * @prop {function} validate Validation function callback. Must return boolean
 */
export default function StressedFormGroupInput(
  props: StressedFormGroupInputProps
) {
  const {
    id,
    name,
    label,
    value,
    validate,
    inputType,
    inputSize,
    placeholder,
    onChange,
    helper,
    hideHeader
  } = props;

  return (
    <FormGroupStructure
      id={id}
      label={label}
      hideHeader={hideHeader}
      helper={helper}
    >
      <StressedField
        value={value.toString()}
        validate={validate}
        onChange={onChange}
        render={({ ref, errored, value, handlers }) => (
          <FormInput
            ref={ref}
            type={inputType}
            name={name}
            id={id}
            invalid={errored}
            stressed={errored}
            size={inputSize}
            value={value}
            placeholder={placeholder?.toString()}
            {...handlers}
          />
        )}
      />
    </FormGroupStructure>
  );
}
