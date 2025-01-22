import { useCallback } from 'react';
import { useVedaUI } from '$context/veda-ui-provider';
/**
 * Hook to access the feedback modal.
 */
export function useFeedbackModal() {
  const { feedbackModalRevealed, setFeedbackModalRevealed } = useVedaUI();

  return {
    isRevealed: feedbackModalRevealed,
    show: useCallback(
      () => setFeedbackModalRevealed(true),
      [setFeedbackModalRevealed]
    ),
    hide: useCallback(
      () => setFeedbackModalRevealed(false),
      [setFeedbackModalRevealed]
    )
  };
}
