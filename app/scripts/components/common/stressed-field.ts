import { useCallback, useEffect, useRef } from 'react';
import T from 'prop-types';

import { useSafeState } from '$utils/use-safe-state';

interface StressedFieldProps {
  render: (renderProps: {
    ref: React.Ref<HTMLInputElement>
    errored: boolean;
    value: string;
    handlers: {
      onKeyPress: (e: React.KeyboardEvent) => void;
      onBlur: () => void;
      onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    };
  }) => JSX.Element;
  value: string;
  validate: (value: string) => boolean;
  onChange: (draftValue: string, setDraftValue: React.Dispatch<string>) => void;
}

/**
 * Component to control the value of a given input.
 * The component accepts a validation function and validates the inserted value.
 * If the value is not valid, the field is marked with a error and then reverted
 * to its original value.
 *
 * @prop {string} value The input field value
 * @prop {function} onChange On change event handler
 * @prop {function} validate Validation function callback. Must return boolean
 * @prop {function} render Render function. Called with signature: (props) =>
 *  Where props:
 *    {boolean} errored Whether the field is in error state
 *    {string} value Value for the field
 *    {function} onChangeHandler Internal change handler to attach the field
 *    {function} onBlurHandler Internal blur handler to attach the field
 */
export default function StressedField(props: StressedFieldProps) {
  const { render, value, validate, onChange } = props;

  const fieldRef = useRef<HTMLInputElement>(null);
  const [errored, setErrored] = useSafeState(false);
  const [draftValue, setDraftValue] = useSafeState(value);

  // Update internal state (draft), when incoming value changes.
  useEffect(() => {
    // setDraftValue is a hook and wont change.
    setDraftValue(value);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [value]);

  const validateField = () => {
    if (!validate(draftValue)) {
      setErrored(true);
      // We have to clear the error state after the animation so it can error
      // again.
      setTimeout(() => {
        setErrored(false);
        setDraftValue(value);
      }, 550);
    } else {
      // all good.
      setErrored(false);
      onChange(draftValue, setDraftValue);
    }
  };

  // setDraftValue is a hook and wont change.
  const onChangeHandler = useCallback(
    (e: React.FormEvent<HTMLInputElement>) =>
      setDraftValue(e.currentTarget.value),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  const onKeypressHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (validate(draftValue)) {
        // If the field is valid blur which will trigger validation a store
        // the value.
        fieldRef.current?.blur();
      } else {
        validateField();
      }
    }
  };

  return render({
    ref: fieldRef,
    errored,
    value: draftValue,
    handlers: {
      onKeyPress: onKeypressHandler,
      onBlur: validateField,
      onChange: onChangeHandler
    }
  });
}

StressedField.propTypes = {
  value: T.oneOfType([T.string, T.number]),
  onChange: T.func,
  validate: T.func,
  render: T.func.isRequired
};
