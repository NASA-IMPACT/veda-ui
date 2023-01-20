import { useCallback, useEffect, useMemo, useState } from "react";
import { DatasetLayer } from "veda/thematics";
import { getDateRangeFormatted } from "../utils";

interface SavedSettings {
    url: string;
    thematicAreaId: string;
    label: string;
  }
  
  const SAVED_SETTINGS_KEY = 'analysisSavedSettings';
  const MAX_SAVED_SETTINGS = 5;

function useSavedSettings(thematicAreaId: string, analysisParamsQs: string, start?: Date, end?: Date, datasetsLayers?:DatasetLayer[]) {
  const onGenerateClick = useCallback(() => {
    const savedSettingsRaw = localStorage.getItem(SAVED_SETTINGS_KEY);
    try {
      let savedSettings: SavedSettings[] = savedSettingsRaw
        ? JSON.parse(savedSettingsRaw)
        : [];
      if (!savedSettings.find((s) => s.url === analysisParamsQs)) {
        savedSettings = [
          {
            url: analysisParamsQs,
            thematicAreaId,
            label: `${datasetsLayers
              ?.map((dL) => dL.name)
              .join(', ')} - ${getDateRangeFormatted(start, end)}`
          },
          ...savedSettings
        ];
        if (savedSettings.length > MAX_SAVED_SETTINGS) {
          savedSettings = savedSettings.slice(1);
        }
        localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify(savedSettings));
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
  }, [analysisParamsQs, datasetsLayers, start, end, thematicAreaId]);

  // Only need to read localStorage at component mount, because whenever the localStorage item is updated,
  // this components gets unmounted anyways (navigating from the page using the 'Generate' button)
  const [savedSettingsList, setSavedSettingsList] = useState<SavedSettings[]>(
    []
  );
  useEffect(() => {
    const savedSettingsRaw = localStorage.getItem('analysisSavedSettings');
    try {
      if (savedSettingsRaw) {
        setSavedSettingsList(JSON.parse(savedSettingsRaw));
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
  }, []);

  const thematicAreaSavedSettingsList = useMemo(() => {
    return savedSettingsList.filter(
      (s) => s.thematicAreaId === thematicAreaId
    );
  }, [savedSettingsList, thematicAreaId]);

  return {
    onGenerateClick,
    thematicAreaSavedSettingsList
  };
}

export default useSavedSettings;
