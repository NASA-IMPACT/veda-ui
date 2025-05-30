declare module 'veda' {
  import * as dateFns from 'date-fns';
  import { MDXModule } from 'mdx/types';
  import { DefaultTheme } from 'styled-components';

  // ///////////////////////////////////////////////////////////////////////////
  //  Datasets                                                                //
  // ///////////////////////////////////////////////////////////////////////////
  type DatasetLayerType = 'raster' | 'vector' | 'zarr' | 'cmr' | 'wms';

  //
  // Dataset Layers
  //
  export type MbProjectionOptions = Exclude<
    mapboxgl.MapOptions['projection'],
    undefined
  >;

  export type ProjectionOptions = {
    id: mapboxgl.ProjectionSpecification['name'] | 'polarNorth' | 'polarSouth';
    parallels?: [number, number];
    center?: [number, number];
  };

  interface DatasetLayerCommonCompareProps {
    mapLabel?: string | DatasetDatumFn<DatasetDatumReturnType>;
  }

  interface DatasetLayerCommonProps extends DatasetLayerCommonCompareProps {
    zoomExtent?: number[];
    bounds?: number[];
    sourceParams?: Record<string, any>;
  }

  export type DatasetDatumFn<T> = (bag: DatasetDatumFnResolverBag) => T;
  export type DatasetDatumReturnType = Primitives | Date;

  export interface DatasetLayerCompareSTAC extends DatasetLayerCommonProps {
    stacCol: string;
    type: DatasetLayerType;
    name: string;
    description: string;
    legend?: LayerLegendCategorical | LayerLegendGradient | LayerLegendText;
  }

  export interface DatasetLayerCompareInternal extends DatasetLayerCommonProps {
    datasetId: string;
    layerId: string;
  }

  export enum TimeDensity {
    YEAR = 'year',
    MONTH = 'month',
    DAY = 'day'
  }
  export interface LayerInfo {
    source: string;
    spatialExtent: string;
    temporalResolution: string;
    unit: string;
  }
  export interface DatasetLayer extends DatasetLayerCommonProps {
    id: string;
    stacCol: string;
    media?: Media;
    stacApiEndpoint?: string;
    tileApiEndpoint?: string;
    name: string;
    description: string;
    initialDatetime?: 'newest' | 'oldest' | string;
    projection?: ProjectionOptions;
    basemapId?: 'dark' | 'light' | 'satellite' | 'topo';
    type: DatasetLayerType;
    compare: DatasetLayerCompareSTAC | DatasetLayerCompareInternal | null;
    legend?: LayerLegendCategorical | LayerLegendGradient | LayerLegendText;
    analysis?: {
      metrics: string[];
      exclude: boolean;
      sourceParams?: Record<string, any>;
    };
    assetUrlReplacements?: {
      from: string;
      to: string;
    };
    time_density?: TimeDensity;
    info?: LayerInfo;
  }
  // A normalized compare layer is the result after the compare definition is
  // resolved from DatasetLayerCompareSTAC or DatasetLayerCompareInternal. The
  // difference with a "base" dataset layer is not having a name and
  // description.
  export interface DatasetLayerCompareBase extends DatasetLayerCommonProps {
    id: string;
    stacCol: string;
    type: DatasetLayerType;
  }
  export interface DatasetLayerCompareNormalized
    extends DatasetLayerCommonProps {
    id: string;
    name: string;
    description: string;
    stacApiEndpoint?: string;
    tileApiEndpoint?: string;
    time_density?: 'day' | 'month' | 'year';
    stacCol: string;
    type: DatasetLayerType;
    legend?: LayerLegendCategorical | LayerLegendGradient | LayerLegendText;
  }

  // export type DatasetLayerCompareNormalized = DatasetLayerCompareNoLegend | DatasetLayerCompareWLegend

  // TODO: Complete once known
  export interface DatasetDatumFnResolverBag {
    /* The date selected by the user */
    datetime?: Date;

    /*
      The date to use for the comparison if the user defined one.
    */
    compareDatetime?: Date;

    /* functions from date-fns package */
    dateFns: typeof dateFns;
  }

  interface LayerLegendUnit {
    label: string;
  }

  export interface LayerLegendGradient {
    type: 'gradient';
    unit?: LayerLegendUnit;
    min: string | number;
    max: string | number;
    stops: string[];
  }

  interface CategoricalStop {
    color: string;
    label: string;
  }

  export interface LayerLegendCategorical {
    type: 'categorical';
    unit?: LayerLegendUnit;
    stops: CategoricalStop[];
  }

  export interface LayerLegendText {
    type: 'text';
  }

  /**
   * Related Contents
   * editors can curate contents per each category with their ids
   */
  export interface RelatedContentData {
    type: 'dataset' | 'story';
    id: string;
    thematic?: string;
  }
  /**
   * Link  Content
   * When the story is a link out to the external/internal content
   */

  export interface LinkContentData {
    url: string;
  }

  export interface DatasetUsage {
    url: string;
    label: string;
    title: string;
  }
  /**
   * Data structure for the Datasets frontmatter.
   */
  export interface DatasetData {
    featured?: boolean;
    sourceExclusive?: string;
    id: string;
    name: string;
    infoDescription?: string;
    taxonomy: Taxonomy[];
    description: string;
    cardDescription?: string;
    usage?: DatasetUsage[];
    media?: Media;
    cardMedia?: Media;
    layers: DatasetLayer[];
    related?: RelatedContentData[];
    disableExplore?: boolean;
    isHidden?: boolean;
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  Stories                                                             //
  // ///////////////////////////////////////////////////////////////////////////

  /**
   * Data structure for the Stories frontmatter.
   */
  export interface StoryData {
    featured?: boolean;
    id: string;
    name: string;
    description: string;
    cardDescription?: string;
    pubDate: string;
    media?: Media;
    cardMedia?: Media;
    taxonomy: Taxonomy[];
    related?: RelatedContentData[];
    asLink?: LinkContentData;
    hideExternalLinkBadge?: boolean;
    isHidden?: boolean;
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  General interfaces and types                                            //
  // ///////////////////////////////////////////////////////////////////////////
  type Primitives = string | number | boolean | null | undefined;

  export interface Media {
    src: string;
    alt: string;
    author?: {
      name: string;
      url: string;
    };
  }

  /**
   * Base structure for each of the data types in veda.
   */
  type VedaData<T> = Record<string, VedaDatum<T> | undefined>;

  export interface VedaDatum<T> {
    /**
     * Contains all the variables in the content's front matter.
     */
    data: T;
    /**
     * Promise to return the MDX content. Setup this way to allow dynamic
     * module loading.
     */
    content: () => Promise<MDXModule>;
  }

  export interface Taxonomy {
    name: string;
    values: TaxonomyItem[];
  }

  interface TaxonomyItem {
    id: string;
    name: string;
  }
  /**
   * Not exporting this type
   * Since we are moving forward to ditching VEDA faux module
   */

  enum SiteAlertType {
    info = 'info',
    emergency = 'emergency'
  }

  const infoTypeFlag = SiteAlertType.info;
  interface SiteAlertData {
    expires: Date;
    title: string;
    content: string;
    type?: SiteAlertType;
  }

  interface BannerData {
    headerText?: string;
    headerActionText?: string;
    ariaLabel?: string;
    flagImgSrc: string;
    flagImgAlt?: string;
    leftGuidance?: GuidanceContent;
    rightGuidance?: GuidanceContent;
    className?: string;
    defaultIsOpen?: boolean;
    contentId?: string;
  }

  interface GuidanceContent {
    icon: string;
    iconAlt?: string;
    title: string;
    text: string;
  }

  interface CookieConsentData {
    title: string;
    copy: string;
  }

  interface InternalNavLink {
    id: string;
    title: string;
    to: string;
    type: 'internalLink';
  }

  interface ExternalNavLink {
    id: string;
    title: string;
    href: string;
    type: 'externalLink';
  }

  type NavLinkItem = ExternalNavLink | InternalNavLink;

  export interface SecondarySection {
    division: string;
    version: string;
    title: string;
    name: string;
    to: string;
    type: string;
  }

  export interface FooterSettings {
    secondarySection: SecondarySection;
    returnToTop: boolean;
  }

  export interface DropdownNavLink {
    id: string;
    title: string;
    type: 'dropdown';
    children: NavLinkItem[];
  }

  /**
   * Named exports: datasets.
   * Object with all the veda datasets keyed by the dataset id.
   */
  export const datasets: VedaData<DatasetData>;

  /**
   * Named exports: stories.
   * Object with all the veda stories keyed by the story id.
   */
  export const stories: VedaData<StoryData>;

  /**
   * Named exports: storyTaxonomies.
   * Contains a static array of Veda story taxonomies.
   * Unlike DatasetTaxonomies which are generated dynamically,
   * story taxonomies are predefined as dynamic filters are not anticipated.
   */
  export const storyTaxonomies: Taxonomy[];

  export type PageOverrides =
    | 'developmentContent'
    | 'aboutContent'
    | 'homeContent'
    | 'storiesHubContent'
    | 'storiesHubHero'
    | 'sandbox-override'
    | 'pageFooter'
    | 'headerBrand'
    | 'homeHero';
  /**
   * Configuration export for specific overrides.
   */
  export const getOverride: (key: PageOverrides) => VedaDatum<any> | undefined;

  export const getString: (variable: string) => {
    one: string;
    other: string;
  };

  export const getBoolean: (variable: string) => boolean;

  export const getSiteAlertFromVedaConfig: () => SiteAlertData | undefined;
  export const getBannerFromVedaConfig: () => BannerData | undefined;
  export const getCookieConsentFromVedaConfig: () =>
    | CookieConsentData
    | undefined;

  export const getNavItemsFromVedaConfig: () =>
    | {
        headerNavItems: (NavLinkItem | DropdownNavLink)[] | undefined;
        footerNavItems: NavLinkItem[] | undefined;
        subNavItems: (NavLinkItem | DropdownNavLink)[] | undefined;
        footerSubNavItems: NavLinkItem[] | undefined;
      }
    | undefined;

  export const getFooterSettingsFromVedaConfig: () =>
    | FooterSettings
    | undefined;

  /**
   * List of custom user defined pages.
   */
  export const userPages: string[];

  export const theme: DefaultTheme | null;
}
