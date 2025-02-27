## DRAFT LOG OF COMPONENTS

### Cards
View Cards at `/sandbox/cards`

| props          | type                                                                  | required | description |
|----------------|-----------------------------------------------------------------------|----------|-------------|
| layout         | string                                                                | no       |             |
| heading        | string \| JSX.Element                                                 | yes      |             |
| footer         | JSX.Element                                                           | yes      |             |
| imgSrc         | string                                                                | yes      |             |
| imgAlt         | string                                                                | yes      |             |
| description    | string \| JSX.Element                                                 | yes      |             |
| gridLayout     | any                                                                   | no       | reference link [here](https://github.com/trussworks/react-uswds/blob/main/src/components/grid/types.ts) for type references |
| styleOverrides | {    headerClassNames ?:   string ;    bodyClassNames ?:   string ; } | no       |             |

#### DefaultCard
* `gridLayout` defaults to `{ desktop: { col: 3 } }`

#### FlagCard
* `layout` defaults to `flagDefault`
* `gridLayout` defaults to `{ desktop: { col: 12 } }` for a full width

### Tags
| props      | type     | required | description |
|------------|----------|----------|-------------|
| items      | string[] | yes      |             |
| classNames | string   | no       |             |