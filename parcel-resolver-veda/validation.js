/* eslint-disable @typescript-eslint/no-var-requires */
const { default: ThrowableDiagnostic } = require('@parcel/diagnostic');

// Throw error if a duplicate id exists.
function validateContentTypeId(list) {
  let ids = {
    // id: 'location'
  };

  list.data.forEach((item, idx) => {
    const id = item.id;
    // No duplicate. Store path in case a duplicate is found.
    if (!ids[id]) {
      ids[id] = list.filePaths[idx];
    } else {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: `Duplicate id property found.`,
          hints: [
            'Check the `id` on the following files',
            ids[id],
            list.filePaths[idx]
          ]
        }
      });
    }
  });
}

// Throw error if layer id is missing or if duplicate.
function validateDatasetLayerId(list) {
  list.data.forEach((item, idx) => {
    let ids = {
      // id: true
    };
    item.layers?.forEach((layer, lIdx) => {
      if (!layer.id) {
        throw new ThrowableDiagnostic({
          diagnostic: {
            message: 'Missing dataset layer `id`',
            hints: [
              `The layer (index: ${lIdx}) is missing the [id] property.`,
              `Check the dataset [${item.id}] at`,
              list.filePaths[idx]
            ]
          }
        });
      }

      if (!ids[layer.id]) {
        ids[layer.id] = true;
      } else {
        throw new ThrowableDiagnostic({
          diagnostic: {
            message: 'Duplicate dataset layer `id`',
            hints: [
              `The layer id [${layer.id}] has been found multiple times.`,
              `Check the dataset [${item.id}] at`,
              list.filePaths[idx]
            ]
          }
        });
      }
    });
  });
}

module.exports = { validateContentTypeId, validateDatasetLayerId };
