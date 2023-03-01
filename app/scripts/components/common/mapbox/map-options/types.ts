import { MbProjectionOptions, ProjectionOptions } from 'veda/thematics';
import { BasemapId, Option } from './basemaps';

export type MapOptionsProps = {
  onProjectionChange: (projection: ProjectionOptions) => void;
  projection: ProjectionOptions;
  basemapStyleId?: BasemapId;
  onBasemapStyleIdChange?: (basemapId: BasemapId) => void;
  labelsOption?: boolean;
  boundariesOption?: boolean;
  onOptionChange?: (option: Option, value: boolean) => void;
};

export type ProjectionConicOptions = {
  center: [number, number];
  parallels: [number, number];
};

export type ProjectionListItem = {
  id: ProjectionOptions['id'];
  mbId: MbProjectionOptions['name'];
  label: string;
  isCustom?: boolean;
  conicValues?: ProjectionConicOptions;
};

export type ProjectionItemProps = {
  onChange: MapOptionsProps['onProjectionChange'];
  id: ProjectionOptions['id'];
  label: string;
  activeProjection: ProjectionOptions;
};

export type ProjectionItemConicProps = ProjectionItemProps & {
  defaultConicValues: ProjectionConicOptions;
};
