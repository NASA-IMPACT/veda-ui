import { MbProjectionOptions, ProjectionOptions } from 'delta/thematics';

export type ProjectionConicOptions = {
  center: [number, number];
  parallels: [number, number];
}

export type ProjectionListItem = {
  id: ProjectionOptions['id'];
  mbId: MbProjectionOptions['name'];
  label: string;
  isCustom?: boolean;
  conicValues?: ProjectionConicOptions;
};

export type ProjectionSelectorProps = {
  onChange: (projection: ProjectionOptions) => void;
  projection: ProjectionOptions;
};

export type ProjectionItemProps = {
  onChange: ProjectionSelectorProps['onChange'];
  id: ProjectionOptions['id'];
  label: string;
  activeProjection: ProjectionOptions;
};

export type ProjectionItemConicProps = ProjectionItemProps & {
  defaultConicValues: ProjectionConicOptions;
};