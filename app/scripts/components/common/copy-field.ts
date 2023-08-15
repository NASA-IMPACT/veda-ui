import { useEffect, useRef, useState } from 'react';
import Clipboard from 'clipboard';

interface CopyFieldProps {
  value: string;
  children: (props: {
    value: string;
    ref: React.MutableRefObject<any>;
    originalValue: string;
    showCopiedMsg: boolean;
  }) => JSX.Element;
}

export function CopyField(props: CopyFieldProps) {
  const { value, children } = props;

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const triggerElement = useRef<any>();

  const copyValue = useRef<string>(value);
  copyValue.current = value;

  useEffect(() => {
    if (!triggerElement.current) throw new Error("ref for trigger element is not set");
    
    let copiedMsgTimeout: NodeJS.Timeout | undefined;
    const clipboard = new Clipboard(triggerElement.current, {
      text: () => copyValue.current
    });

    clipboard.on('success', () => {
      setShowCopiedMsg(true);
      copiedMsgTimeout = setTimeout(() => {
        setShowCopiedMsg(false);
      }, 2000);
    });

    return () => {
      clipboard.destroy();
      if (copiedMsgTimeout) {
        clearTimeout(copiedMsgTimeout);
      }
    };
  }, []);

  const val = showCopiedMsg ? 'Copied!' : value;

  return children({
    value: val,
    ref: triggerElement,
    originalValue: value,
    showCopiedMsg
  });
}
