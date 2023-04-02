import { FeatureCollection, Polygon } from 'geojson';
import { useCallback, useEffect, useState } from 'react';

interface AnalysisParams {
  start?: Date;
  end?: Date;
  datasets?: string[];
  aoi?: FeatureCollection<Polygon>;
}

interface SavedSettings {
  url: string;
  params: Required<AnalysisParams>;
}

interface useSavedSettingsParams {
  analysisParamsQs?: string;
  params?: AnalysisParams;
}

const SAVED_SETTINGS_KEY = 'analysisSavedSettings';
const MAX_SAVED_SETTINGS = 5;

function useSavedSettings(opts: useSavedSettingsParams = {}) {
  const { analysisParamsQs, params = {} } = opts;

  // Only need to read localStorage at component mount, because whenever the
  // localStorage item is updated, this components gets unmounted anyways
  // (navigating from the page using the 'Generate' button)
  const [savedSettingsList, setSavedSettingsList] = useState<SavedSettings[]>(
    []
  );
  useEffect(() => {
    const savedSettingsRaw = localStorage.getItem(SAVED_SETTINGS_KEY);
    try {
      if (savedSettingsRaw) {
        setSavedSettingsList(JSON.parse(savedSettingsRaw));
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
  }, []);

  const onGenerateClick = useCallback(() => {
    if (Object.values(params).some((v) => !v) || !analysisParamsQs) {
      /* eslint-disable-next-line no-console */
      console.log(
        'Analysis parameters missing. Can not save to localstorage',
        params
      );
      return;
    }

    try {
      if (!savedSettingsList.find((s) => s.url === analysisParamsQs)) {
        const newSettings = [
          {
            // At this point the params and url are required.
            url: analysisParamsQs!,
            params: params as SavedSettings['params']
          },
          ...savedSettingsList.slice(0, MAX_SAVED_SETTINGS - 1)
        ];

        localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify(newSettings));
        setSavedSettingsList(newSettings);
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
    // params will be left out of the dependency array since it is an object and
    // changes on every render. analysisParamsQs is the url version of params,
    // so when params change, analysisParamsQs is guaranteed to change as well.
  }, [savedSettingsList, analysisParamsQs]);

  return {
    onGenerateClick,
    savedSettingsList
  };
}

export default useSavedSettings;
