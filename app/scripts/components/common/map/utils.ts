import { validateRangeNum } from "$utils/utils";

export const validateLon = validateRangeNum(-180, 180);
export const validateLat = validateRangeNum(-90, 90);