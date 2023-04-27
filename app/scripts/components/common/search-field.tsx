import React, { InputHTMLAttributes, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { FormInput, formSkinStylesProps } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import {
  CollecticonDiscXmark,
  CollecticonMagnifierLeft
} from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

const SearchFieldWrapper = styled.div`
  position: relative;
  display: flex;

  ::before {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: block;
    content: '';
    border-radius: ${themeVal('shape.rounded')};
    box-shadow: inset 0 0 0 1px ${themeVal('color.base')};
  }
`;

const SearchFieldClearable = styled.div<{ isOpen: boolean }>`
  display: flex;
  overflow: hidden;
  transition: max-width 320ms ease-in-out;
  max-width: 0;

  ${({ isOpen }) =>
    isOpen &&
    css`
      max-width: 20rem;
    `}
`;

const FormInputSearch = styled(FormInput)`
  border: 0;
  padding-left: 0;
  padding-right: 0;
`;

interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange'
  > {
  size: formSkinStylesProps['size'];
  value: string;
  onChange: (value: string) => void;
  keepOpen?: boolean;
}

function SearchField(props: SearchFieldProps) {
  const { value, onChange, keepOpen, size, ...rest } = props;

  const fieldRef = useRef<HTMLInputElement>(null);
  const [isFocused, setFocused] = useState(false);

  return (
    <SearchFieldWrapper className='search-field'>
      <Button
        size={size}
        fitting='skinny'
        onClick={() => {
          fieldRef.current?.focus();
          setFocused(true);
        }}
      >
        <CollecticonMagnifierLeft meaningful title='Open search' />
      </Button>
      <SearchFieldClearable isOpen={isFocused || !!value.length || !!keepOpen}>
        <FormInputSearch
          ref={fieldRef}
          {...rest}
          size={size}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
        />

        <Button
          disabled={!value.length}
          size={size}
          fitting='skinny'
          onClick={() => {
            onChange('');
          }}
        >
          <CollecticonDiscXmark meaningful title='Clear search' />
        </Button>
      </SearchFieldClearable>
    </SearchFieldWrapper>
  );
}

export default SearchField;
