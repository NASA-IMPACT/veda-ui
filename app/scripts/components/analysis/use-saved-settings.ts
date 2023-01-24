import { FeatureCollection, Polygon } from 'geojson';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface AnalysisParams {
  start?: Date;
  end?: Date;
  datasets?: string[];
  aoi?: FeatureCollection<Polygon>;
}

interface SavedSettings {
  thematicAreaId: string;
  url: string;
  params: Required<AnalysisParams>;
}

interface useSavedSettingsParams {
  thematicAreaId: string;
  analysisParamsQs?: string;
  params?: AnalysisParams;
}

const SAVED_SETTINGS_KEY = 'analysisSavedSettings';
const MAX_SAVED_SETTINGS = 5;

function useSavedSettings(opts: useSavedSettingsParams) {
  const { thematicAreaId, analysisParamsQs, params = {} } = opts;

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
    if (Object.values(params).some((v) => !v) || analysisParamsQs) {
      /* eslint-disable-next-line no-console */
      console.log(
        'Analysis parameters missing. Can not save to localstorage',
        params
      );
      return;
    }

    try {
      // Get settings for this thematic area analysis.
      const thematicAreaSettings = savedSettingsList.filter(
        (s) => s.thematicAreaId === thematicAreaId
      );

      if (!thematicAreaSettings.find((s) => s.url === analysisParamsQs)) {
        const newThematicAreaSettings = [
          {
            thematicAreaId,
            // At this point the params and url are required.
            url: analysisParamsQs!,
            params: params as SavedSettings['params']
          },
          ...thematicAreaSettings.slice(0, MAX_SAVED_SETTINGS - 1)
        ];

        const otherThematicAreaSettings = savedSettingsList.filter(
          (s) => s.thematicAreaId !== thematicAreaId
        );

        const newSettings = [
          ...newThematicAreaSettings,
          ...otherThematicAreaSettings
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
  }, [savedSettingsList, analysisParamsQs, thematicAreaId]);

  const thematicAreaSavedSettingsList = useMemo(() => {
    return savedSettingsList.filter((s) => s.thematicAreaId === thematicAreaId);
  }, [savedSettingsList, thematicAreaId]);

  return {
    onGenerateClick,
    thematicAreaSavedSettingsList
  };
}

export default useSavedSettings;
