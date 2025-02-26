## DRAFT LOG OF COMPONENTS

### Cards
##### Common props across cards
| props          | type                                                                  | required | description |
|----------------|-----------------------------------------------------------------------|----------|-------------|
| layout         | string                                                                | no       |             |
| heading        | string \| JSX.Element                                                 | yes      |             |
| footer         | JSX.Element                                                           | yes      |             |
| imgSrc         | string                                                                | yes      |             |
| imgAlt         | string                                                                | yes      |             |
| description    | string \| JSX.Element                                                 | yes      |             |
| styleOverrides | {    headerClassNames ?:   string ;    bodyClassNames ?:   string ; } | no       |             |

#### FlagLayoutCard
* `layout` defaults to `flagDefault`
