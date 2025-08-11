### Raster Based Dataset Visualization on E&A

The E&A platform visualizes different types of datasets through MapboxGL's rendering engine. Each data source type has its own hook to transform required inputs into a TileURL that MapboxGL can render as a raster paint layer. The current data types VEDA Dashboard supports are `raster-timeseries`, `cmr`, `wms` and `zarr` as of May 2025.

The diagram outlines how various data sources are processed through different hooks before being visualized on the map.

![Diagram showing how each layer gets TileURLs](/docs/media/raster-based-layers.png)
