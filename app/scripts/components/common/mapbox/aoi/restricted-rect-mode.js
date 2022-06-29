import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';

import { mod } from '$utils/utils';

export function enable(modes) {
  return {
    ...modes,
    draw_rectangle: DrawRectangle,
    direct_select: patchDirectSelect(modes.direct_select)
  };
}

// Patch direct_select so that neighboring vertices also move when one is
// dragged, thus maintaining the rectangle shape.
function patchDirectSelect(DirectSelect) {
  const DirectSelectRectangle = {
    ...DirectSelect,

    // On setup hide the midpoints layers.
    onSetup: function (opts) {
      // Hide layers for midpoint if they exist.
      ['gl-draw-polygon-midpoint.cold', 'gl-draw-polygon-midpoint.hot'].forEach(
        (l) => {
          if (this.map.getLayer(l)) {
            this.map.setLayoutProperty(l, 'visibility', 'none');
          }
        }
      );
      // Continue as normal. Call super();
      return DirectSelect.onSetup.call(this, opts);
    },

    // Prevent midpoint click from doing anything.
    onMidpoint: function () {
      /* disable */
    },

    // Ensure that only one vertex is selected at any given time, even if shift
    // key is pressed.
    onVertex: function (state, e) {
      this.startDragging(state, e);
      const about = e.featureTarget.properties;
      state.selectedCoordPaths = [about.coord_path];
      const selectedCoordinates = this.pathsToCoordinates(
        state.featureId,
        state.selectedCoordPaths
      );
      this.setSelectedCoordinates(selectedCoordinates);
    },

    // Ensure correct dragging of the rectangle.
    onDrag: function (state, e) {
      if (state.canDragMove !== true) return;
      state.dragMoving = true;
      e.originalEvent.stopPropagation();
      const delta = {
        lng: e.lngLat.lng - state.dragMoveLocation.lng,
        lat: e.lngLat.lat - state.dragMoveLocation.lat
      };

      if (state.selectedCoordPaths.length > 0) {
        this.dragVertex(state, e, delta);

        // Current vertex index.
        const cVx = Number(state.selectedCoordPaths[0].split('.')[1]);
        // Previous vertex index.
        const pVx = mod(cVx - 1, 4);
        // Next vertex index.
        const nVx = mod(cVx + 1, 4);
        // Previous vertex coordinates.
        const pVxCoords = state.feature.getCoordinate(`0.${pVx}`);
        // Next vertex coordinates.
        const nVxCoords = state.feature.getCoordinate(`0.${nVx}`);

        // 0 - - - - 1
        // |         |  The coordinates we move depend on what vertex we're moving.
        // |         |  Vertex count goes clockwise starting at NW.
        // 3 - - - - 2
        if (cVx % 2 === 0) {
          // O - - - - o
          // |         |  When moving even indexed vertexes, the previous vertex
          // |         |  only moves longitudinally and the next latitudinally.
          // o - - - - O
          state.feature.updateCoordinate(
            `0.${pVx}`,
            pVxCoords[0] + delta.lng,
            pVxCoords[1]
          );
          state.feature.updateCoordinate(
            `0.${nVx}`,
            nVxCoords[0],
            nVxCoords[1] + delta.lat
          );
        } else {
          // o - - - - O
          // |         |  When moving odd indexed vertexes, the previous vertex
          // |         |  only moves latitudinally and the next longitudinally.
          // O - - - - o
          state.feature.updateCoordinate(
            `0.${pVx}`,
            pVxCoords[0],
            pVxCoords[1] + delta.lat
          );
          state.feature.updateCoordinate(
            `0.${nVx}`,
            nVxCoords[0] + delta.lng,
            nVxCoords[1]
          );
        }
      } else {
        this.dragFeature(state, e, delta);
      }

      state.dragMoveLocation = e.lngLat;
    }
  };

  return DirectSelectRectangle;
}
