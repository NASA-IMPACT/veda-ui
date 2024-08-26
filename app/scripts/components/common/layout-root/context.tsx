import React, { 
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import { useSlidingStickyHeader } from '$utils/use-sliding-sticky-header';

interface LayoutRootContextProps extends Record<string, any> {
  setLayoutProps: Dispatch<SetStateAction<Record<string, any>>>;
  isHeaderHidden: boolean;
  headerHeight: number;
  wrapperHeight: number;
  feedbackModalRevealed: boolean;
  setFeedbackModalRevealed: Dispatch<SetStateAction<boolean>>;
}

export const LayoutRootContext = createContext({} as LayoutRootContextProps);

export function LayoutRootContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [layoutProps, setLayoutProps] = useState<Record<string, any>>({});
  const [feedbackModalRevealed, setFeedbackModalRevealed] =
    useState<boolean>(false);

  // Put the header size and visibility status in the context so that children
  // elements can access them for positioning purposes.
  const location = useLocation();
  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeader(location);

  const ctx = {
    ...layoutProps,
    setLayoutProps,
    isHeaderHidden,
    headerHeight,
    wrapperHeight,
    feedbackModalRevealed,
    setFeedbackModalRevealed
  };

  return (
    <LayoutRootContext.Provider value={ctx}>
      {children}
    </LayoutRootContext.Provider>
  );
}
