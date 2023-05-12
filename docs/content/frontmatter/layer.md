# layer

- [layer](#layer)
  - [Properties](#properties)
    - [Projection](#projection)
    - [Legend](#legend)
    - [Compare](#compare)
  - [Function values](#function-values)

```yaml
id: string
stacCol: string
name: string
type: string
initialDatetime: 'oldest' | 'newest' | Date(YYYY-MM-DD) = 'newest'
description: string
projection: Projection
zoomExtent: [int, int] | null | fn(bag)
sourceParams:
  [key]: value | fn(bag)
compare: Compare
legend: Legend
```

## Properties

> 🙋 Several layer properties support functions to provide the app with dynamic values. See [Function values](#function-values) at the end of the document for details.

**id**  
`string`  
Id of the layer, using lowercase characters and dashes (Example: `no2-monthly-diff`).  
Must be unique in a dataset.  

**stacCol**  
`string`  
The stac collection that this layer should load.

**name**  
`string`  
Name of the layer for display purposes.

**type**  
`raster | vector`  
The type of the layer will define how the data is displayed on the map.  
⚠️ Vector datasets are should be in vector titles format with a source layer named `default`. It is currently not possible to customize the style of the dataset's features.

**description**  
`string`  
Brief description of the layer. Will be shown in an info box.

**initialDatetime**  
`'oldest' | 'newest' | Date(YYYY-MM-DD) = 'newest'`  
Define the initial date that is shown when enabling a timeseries layer. This value is used if no valid date is provided via the url parameters

**zoomExtent**  
`[int, int] | fn(bag)`  
Minimum and maximum zoom values for the layer. Below the minimum zoom level the layer will not be shown, but markers will be displayed to indicate where data is available.

**sourceParams**  
`object`  
Parameters to be appended to the tile source. The values will be used as provided as query string parameters.  
These values may vary greatly depending on the layer being added but some may be:
- **rescale**  
  `[int, int] | fn(bag)`  
  Minimum and maximum value for the rescale. This value is used for the color mapping, such that the minimum value corresponds to the starting color of the color map, and the maximum value corresponds to the ending. Adjusting this value changes the underlying data values mapped to the colors allowing for the analysis of different trends.
- **colormap_name**  
  `string`  
  The colormap to use for the layer. One of https://cogeotiff.github.io/rio-tiler/colormap/#default-rio-tilers-colormaps

### Projection

**projection**  
`object`  
Define the starting [projection](https://docs.mapbox.com/mapbox-gl-js/guides/projections/) to use for this layer. The user will still be able to change the projection as they explore the map, but an initial one may be defined.

```yaml
id: 'albers' | 'equalEarth' | 'equirectangular' | 'lambertConformalConic' | 'mercator' | 'naturalEarth' | 'winkelTripel' | 'globe' | 'polarNorth' | 'polarSouth'
center: [int, int]
parallels: [int, int]
```

**projection.id**  
`albers | equalEarth | equirectangular | lambertConformalConic | mercator | naturalEarth | winkelTripel | globe | polarNorth | polarSouth`  
The id of the projection to set. Besides all the projections offered by mapbox, veda supports two additional ones `polarNorth | polarSouth`. These are not true polar projections but are achieved using specific `center` and `parallels` values of the `lambertConformalConic` projection.

**projection.center**  
`[int, int]`  
Projection center. Required for Conic projections like `lambertConformalConic` and `albers`.

**projection.parallels**  
`[int, int]`  
Projection parallels. Required for Conic projections like `lambertConformalConic` and `albers`.

### Legend

**legend**  
`object`  
Legend for this layer. This is shown in the interface as a visual guide to the user. The resulting legend will depend on the selected type.

```yaml
type: categorical | gradient
unit:
  label: string
min: string
max: string
stops: string[] | object[]
  - string[]
  # or
  - color: string
    label: string
```

**legend.type**  
`categorical | gradient`  

<table>
<tr>
<th>Gradient</th>
<th>Categorical</th>
</tr>
<tr>
<td>

A `gradient` legend will display a continuous color scale using the provided stops which are rendered equally spaced from each other.
</td>
<td>

A `categorical` legend will display discreet color buckets according to the defined stops.
</td>
</tr>
<tr>
<td width='50%'>

![](../media/legend-gradient.png)
</td>
<td width='50%'>

![](../media/legend-categorical.png)
</td>
</tr>
</table>

**legend.unit**  
`object`  
Settings for the unit.

**legend.unit.label**  
`string`  
Unit label. Shown whenever a label for the values is needed. (Ex: The chart axis on the analysis page)

**legend.min**  
`string`  
The label for the legend’s minimum value.  
⚠️ Not used when the legend is `categorical`.

**legend.max**  
`string`  
The label for the legend’s maximum value.  
⚠️ Not used when the legend is `categorical`.

**legend.stops**  
`string[] | object[]`  
The legend stops define the colors that should be rendered.  

In the case of `gradient` legends, this should be an array of color strings:
```yaml
stops:
  - '#FF0000'
  - '#00FF00'
  - '#0000FF'
```

If the legend is `categorical`, each entry should be an object with a color and a label. These values will be displayed so that there’s a clear mapping between color and label.
```yaml
stops:
  - color: '#FF0000'
    label: Corn
  - color: '#00FF00'
    label: Wheat
  - color: '#0000FF'
    label: Barley
```

### Compare

**compare**  
`object`  
Through the compare settings it is possible to define which layer should be loaded when the comparison gets enabled.  

There are 2 ways of defining compare layers:
1. The first, and easiest, is when the layer we want to compare to, is defined as a layer of a dataset. In this case we only need to reference the `datasetId` and the `layerId` (besides the other meta properties).
```yaml
compare:
  datasetId: string
  layerId: string
```

2. The second option is to compare to a layer which is not part of a dataset but still accessible via the api as a STAC item. This option requires us to fully define a layer within the `compare` object.
```yaml
compare:
  stacCol: string
  stacFilter: object
  type: raster | vector
  zoomExtent: [int, int] | null | fn
  sourceParams:
    [key]: value | fn
```

⚠️ Option 2 is not currently implemented.

There are additional properties which are common to both ways of defining compare layers:
```yaml
compare:
  mapLabel: string | fn
```

**compare.mapLabel**  
`string | fn(bag)`  
When the comparison is enabled, the user should be informed about what is being shown. Could be a static string like “Modeled vs Real” or something dynamic computed from input parameters. It is often used for operations with dates.

**compare.datasetId**  
`string`  
Id of the dataset from which to get the layer.  
⚠️ Only used when the layer belongs to a dataset present in the application.

**compare.layerId**  
`string`  
Id of the layer we want to compare to. The layer must belong to the dataset defined through `layer.compare.datasetId`.  
⚠️ Only used when the layer belongs to a dataset present in the application.


## Function values
Several layer properties support functions to provide the app with dynamic values.  Functions are written in javascript syntax and must be prefixed with `::js`.
Example:
```yaml
property: ::js () => 'value'
```

For more complicated functions it is helpful to spread them in multiple lines. To achieve this we can use the YAML Block Style Indicator (`|` pipe).
```yaml
property: |
  ::js () => {
    const val = 'value';
    return val;
  }
```

All these functions will be resolved by the app with a parameter (`bag`) containing helpers and internal values to help determining the correct value.  
Properties of `bag`:
```js
{
  datetime: Date // The date that is currently selected
  compareDatetime: Date // The date that the user selected to compare with. Null if nothing is selected.
  dateFns: Object // All the functions of https://date-fns.org/
  raw: Object // The unresolved layer data - kind of a self reference.
}
```

Usage example:
```yaml
property: | 
  ::js (bag) => {
    return bag.foo ? 'bar' : 'baz'
  }
```

Example of the `compare.mapLabel` being dynamically set as "Date VS Date" (Ex: May 2020 VS May 2019`):
```yaml
compare:
  mapLabel: |
    ::js ({ dateFns, datetime, compareDatetime }) => {
      return `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`;
    }
```
