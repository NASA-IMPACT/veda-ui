/**
 * STOPGAP: Hardcoded Collecticons data URIs
 *
 * This file contains hardcoded data URI strings extracted from @devseed-ui/collecticons.
 * This is a temporary stopgap to break the react-dom/server dependency for iconDataURI generation.
 *
 * ⚠️ IMPORTANT: These icons are from Collecticons and should NOT be used for new development.
 * For new icon changes, use USWDS icons from @trussworks/react-uswds.
 *
 * These hardcoded strings maintain exact visual compatibility while allowing us to
 * remove the Collecticons dependency in the future.
 *
 */

export const COLLECTICON_DATA_URIS = {
  // Catalog card icons (from Collecticons)
  // TODO: Replace with USWDS Icon.Add when component is refactored
  COLLECTICON_PLUS_WHITE:
    'data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22plus__CollecticonPlus-sc-1fkp87s-0%22%3E%3Ctitle%3Eplus%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%2215%2C7%209%2C7%209%2C1%207%2C1%207%2C7%201%2C7%201%2C9%207%2C9%207%2C15%209%2C15%209%2C9%2015%2C9%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E',

  // TODO: Replace with USWDS Icon.Check when component is refactored
  COLLECTICON_TICK_SMALL_WHITE:
    'data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22tick-small__CollecticonTickSmall-sc-1gw1pv0-0%22%3E%3Ctitle%3Etick%20small%20icon%3C%2Ftitle%3E%3Cpath%20d%3D%22M2%2C9.014L3.414%2C7.6L6.004%2C10.189L12.593%2C3.6L14.007%2C5.014L6.003%2C13.017L2%2C9.014Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',

  // Maps comparison swiper icons (from Collecticons)
  // TODO: Replace with USWDS Icon.NavigateBefore/NavigateNext when component is refactored
  COLLECTICON_CHEVRON_LEFT_SMALL_WHITE:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22chevron-left-small__CollecticonChevronLeftSmall-sc-18vjqa1-0%22%3E%3Ctitle%3Echevron%20left%20small%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%2211.414%2C12.586%206.828%2C8%2011.414%2C3.414%2010%2C2%204%2C8%2010%2C14%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E',
  COLLECTICON_CHEVRON_RIGHT_SMALL_WHITE:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22chevron-right-small__CollecticonChevronRightSmall-sc-1oue0hw-0%22%3E%3Ctitle%3Echevron%20right%20small%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%224.586%2C3.414%209.172%2C8%204.586%2C12.586%206%2C14%2012%2C8%206%2C2%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E',

  // Mapbox control icons (from Collecticons)
  // TODO: Replace with USWDS Icon.ZoomIn/ZoomOut when component is refactored
  COLLECTICON_PLUS_SMALL_BASE:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23333333%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22plus-small__CollecticonPlusSmall-sc-1fqmt3p-0%22%3E%3Ctitle%3Eplus%20small%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%2214%2C7%209%2C7%209%2C2%207%2C2%207%2C7%202%2C7%202%2C9%207%2C9%207%2C14%209%2C14%209%2C9%2014%2C9%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E',
  COLLECTICON_MINUS_SMALL_BASE:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23333333%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22minus-small__CollecticonMinusSmall-sc-idjajx-0%22%3E%3Ctitle%3Eminus%20small%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%2214%2C7%202%2C7%202%2C9%2014%2C9%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E',

  // TODO: Replace with USWDS Icon.Search when component is refactored
  COLLECTICON_MAGNIFIER_LEFT_BASE:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23333333%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22magnifier-left__CollecticonMagnifierLeft-sc-16fyszn-0%22%3E%3Ctitle%3Emagnifier%20left%20icon%3C%2Ftitle%3E%3Cpath%20d%3D%22M15.708%2C13.587l-3.675-3.675C12.646%2C8.92%2C13%2C7.751%2C13%2C6.5C13%2C2.91%2C10.09%2C0%2C6.5%2C0S0%2C2.91%2C0%2C6.5S2.91%2C13%2C6.5%2C13%20c1.251%2C0%2C2.42-0.354%2C3.412-0.967l3.675%2C3.675c0.389%2C0.389%2C1.025%2C0.389%2C1.414%2C0l0.707-0.707%20C16.097%2C14.612%2C16.097%2C13.976%2C15.708%2C13.587z%20M3.318%2C9.682C2.468%2C8.832%2C2%2C7.702%2C2%2C6.5s0.468-2.332%2C1.318-3.182S5.298%2C2%2C6.5%2C2%20s2.332%2C0.468%2C3.182%2C1.318C10.532%2C4.168%2C11%2C5.298%2C11%2C6.5s-0.468%2C2.332-1.318%2C3.182C8.832%2C10.532%2C7.702%2C11%2C6.5%2C11%20S4.168%2C10.532%2C3.318%2C9.682z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',

  // TODO: Replace with USWDS Icon.Close when component is refactored
  COLLECTICON_XMARK_SMALL_BASE300:
    'data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23666666%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20role%3D%22img%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%20class%3D%22xmark-small__CollecticonXmarkSmall-sc-194sjhs-0%22%3E%3Ctitle%3Exmark%20small%20icon%3C%2Ftitle%3E%3Cpolygon%20points%3D%2213.707%2C3.707%2012.293%2C2.293%208%2C6.586%203.707%2C2.293%202.293%2C3.707%206.586%2C8%202.293%2C12.293%203.707%2C13.707%208%2C9.414%20%2012.293%2C13.707%2013.707%2C12.293%209.414%2C8%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E'
} as const;
