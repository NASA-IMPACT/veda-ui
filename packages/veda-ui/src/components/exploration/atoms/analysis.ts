import { atom } from 'jotai';

// Analysis controller. Stores high level state about the analysis process.
export const analysisControllerAtom = atom({
  isAnalyzing: false,
  runIds: {} as Record<string, number | undefined>,
  isObsolete: false
});
