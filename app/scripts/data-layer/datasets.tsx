import { datasets, stories } from 'veda';

// @VEDA2-REFACTOR-WORK

/**
 * @NOTE
 * 
 * All datasets should now be referenced to use this data-layer, as this should serve as the main source of truth
 * Eventually this would go away as we wont depend on the veda faux modules anymore and data would eventually come down from the instances
 * 
 * @TECH-DEBT
 * veda virtual modules may go away, but this is used here for now until it is removed entirely or updated
 */


export const veda_faux_module_datasets = datasets;
export const veda_faux_module_stories = stories;