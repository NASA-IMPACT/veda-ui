import { MbProjectionOptions, ProjectionOptions } from 'veda';
import { BasemapId, Option } from './basemap';

export interface MapOptionsProps {
  onProjectionChange: (projection: ProjectionOptions) => void;
  projection: ProjectionOptions;
  basemapStyleId?: BasemapId;
  onBasemapStyleIdChange?: (basemapId: BasemapId) => void;
  labelsOption?: boolean;
  boundariesOption?: boolean;
  onOptionChange?: (option: Option, value: boolean) => void;
}

export interface ProjectionConicOptions {
  center: [number, number];
  parallels: [number, number];
}

export interface ProjectionListItem {
  id: ProjectionOptions['id'];
  mbId: MbProjectionOptions['name'];
  label: string;
  isCustom?: boolean;
  conicValues?: ProjectionConicOptions;
}

export interface ProjectionItemProps {
  onChange: MapOptionsProps['onProjectionChange'];
  id: ProjectionOptions['id'];
  label: string;
  activeProjection: ProjectionOptions;
}

export type ProjectionItemConicProps = ProjectionItemProps & {
  defaultConicValues: ProjectionConicOptions;
};
