import React, { InputHTMLAttributes, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  FormHelperMessage,
  FormInput,
  formSkinStylesProps
} from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import {
  CollecticonDiscXmark,
  CollecticonMagnifierLeft
} from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

const SearchFieldWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  width: 100%;
`;

interface SearchFieldMessageProps {
  isOpen: boolean;
  isFocused: boolean;
}

const SearchFieldMessage = styled(FormHelperMessage)<SearchFieldMessageProps>`
  line-height: 1.5rem;
  transition: max-width 320ms ease-in-out, opacity 160ms ease-in-out 160ms;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;

  ${({ isOpen }) =>
    isOpen &&
    css`
      width: 100%;
      max-width: 100%;
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      opacity: 1;
    `}
`;

const SearchFieldContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  background-color: ${themeVal('color.surface')};
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
      width: 100%;
      max-width: 100%;
    `}
`;

const FormInputSearch = styled(FormInput)`
  border: 0;
  padding-left: 0;
  padding-right: 0;
  width: 100%;
`;

interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange' | 'dangerouslySetInnerHTML'
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

  const isOpen = isFocused || !!value.length || !!keepOpen;

  return (
    <SearchFieldWrapper className='search-field'>
      <SearchFieldContainer>
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
        <SearchFieldClearable isOpen={isOpen}>
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

          {!!value.length && (
            <Button
              size={size}
              fitting='skinny'
              onClick={() => {
                onChange('');
              }}
            >
              <CollecticonDiscXmark meaningful title='Clear search' />
            </Button>
          )}
        </SearchFieldClearable>
      </SearchFieldContainer>
      <SearchFieldMessage isOpen={isOpen} isFocused={isFocused}>
        Minimum 3 characters
      </SearchFieldMessage>
    </SearchFieldWrapper>
  );
}

export default SearchField;
