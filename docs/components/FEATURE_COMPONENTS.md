## DRAFT LOG OF COMPONENTS AND PROPS
### CatalogContent
| props             | type                                                                    | required | description |
|-------------------|-------------------------------------------------------------------------|----------|-------------|
| datasets          | DatasetData []                                                          | yes      |             |
| search            | string                                                                  | yes      |             |
| taxonomies        | Record < string ,  string []>                                           | yes      |             |
| onAction          | onAction :  ( action :   FilterActions ,  value ?:   any )  =>   void ; | yes      |             |
| selectedIds       | string[]                                                                | no       |             |
| setSelectedIds    | ( selectedIds :   string [])  =>   void                                 | no       |             |
| filterLayers      | boolean                                                                 | no       |             |
| emptyStateContent | ReactNode                                                               | no       |             |
### ExplorationAndAnalysis
{TO BE FILLED OUT}
### StoriesHubContent
{TO BE FILLED OUT}