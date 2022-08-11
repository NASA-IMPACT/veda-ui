import { MbProjectionOptions, ProjectionOptions } from 'delta/thematics';

import { validateRangeNum } from '$utils/utils';
import { ProjectionListItem } from './types';

// The id is internal to the app.
// The mbId is the projection name to use with mapbox. This is needed because
// multiple projections can be made from the same mapbox Id just by tweaking the
// parallels and center values
export const projectionsList: ProjectionListItem[] = [
  { id: 'globe', mbId: 'globe', label: 'Globe' },
  {
    id: 'albers',
    mbId: 'albers',
    label: 'Albers',
    conicValues: {
      center: [-96, 37.5],
      parallels: [29.5, 45.5]
    }
  },
  { id: 'equalEarth', mbId: 'equalEarth', label: 'Equal Earth' },
  { id: 'equirectangular', mbId: 'equirectangular', label: 'Equirectangular' },
  {
    id: 'lambertConformalConic',
    mbId: 'lambertConformalConic',
    label: 'Lambert Conformal Conic',
    conicValues: {
      center: [0, 30],
      parallels: [30, 30]
    }
  },
  { id: 'mercator', mbId: 'mercator', label: 'Mercator' },
  { id: 'naturalEarth', mbId: 'naturalEarth', label: 'Natural Earth' },
  { id: 'winkelTripel', mbId: 'winkelTripel', label: 'Winkel Tripel' },
  {
    id: 'polarNorth',
    mbId: 'lambertConformalConic',
    label: 'Polar North',
    isCustom: true,
    conicValues: {
      center: [-40, 0],
      parallels: [90, 90]
    }
  },
  {
    id: 'polarSouth',
    mbId: 'lambertConformalConic',
    label: 'Polar South',
    isCustom: true,
    conicValues: {
      center: [-40, 0],
      parallels: [-89.99, -89.99]
    }
  }
];

// Default value for the projection state.
export const projectionDefault: ProjectionOptions = {
  id: 'mercator'
};

/**
 * Return the correct format needed by mapbox to display the projection. We use
 * custom projections that do not exist in mapbox and therefore we need to get
 * the correct name and parallels and center values.
 * For example the projection with id polarNorth is actually named
 * lambertConformalConic
 */
export const convertProjectionToMapbox = (
  projection: ProjectionOptions
): MbProjectionOptions => {
  const p = projectionsList.find((proj) => proj.id === projection.id);

  if (!p) {
    /* eslint-disable-next-line no-console */
    console.error('projection', projection);
    throw new Error(`Invalid projection with id: ${projection.id}`);
  }

  return {
    ...projection,
    name: p.mbId
  };
};

export const validateLon = validateRangeNum(-180, 180);
export const validateLat = validateRangeNum(-90, 90);

export function validateProjectionBlockProps({
  id,
  center,
  parallels
}: Partial<ProjectionOptions>) {
  // Projections
  const projectionErrors: string[] = [];
  if (id) {
    const allowedProjections = projectionsList.map((p) => p.id);
    const projectionsConic = projectionsList
      .filter((p) => !!p.conicValues)
      .map((p) => p.id);

    if (!allowedProjections.includes(id)) {
      const a = allowedProjections.join(', ');
      projectionErrors.push(`- Invalid projectionId. Must be one of: ${a}.`);
    }

    if (projectionsConic.includes(id)) {
      if (!center || !validateLon(center[0]) || !validateLat(center[1])) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionCenter. This property is required for ${o} projections. Use [longitude, latitude].`
        );
      }

      if (
        !parallels ||
        !validateLat(parallels[0]) ||
        !validateLat(parallels[1])
      ) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionParallels. This property is required for ${o} projections. Use [Southern parallel latitude, Northern parallel latitude].`
        );
      }
    }
  }

  return projectionErrors;
}
