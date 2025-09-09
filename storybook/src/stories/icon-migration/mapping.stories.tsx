import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
// Import custom icons from custom-icon folder
import {
  CalendarMinusIcon,
  CalendarPlusIcon,
  DropIcon
} from '$components/common/custom-icon';

// Import all collecticons from icons-legacy
import {
  CollecticonArrowRight,
  CollecticonArrowLoop,
  CollecticonChartLine,
  CollecticonChevronRightSmall,
  CollecticonChevronDownSmall,
  CollecticonCircleQuestion,
  CollecticonCircleXmark,
  CollecticonCircleInformation,
  CollecticonCompass,
  CollecticonDrop,
  CollecticonExpandTopRight,
  CollecticonHamburgerMenu,
  CollecticonMap,
  CollecticonPage,
  CollecticonTick,
  CollecticonXmark,
  CollecticonXmarkSmall,
  CollecticonMagnifierPlus,
  CollecticonMagnifierMinus,
  CollecticonCalendarPlus,
  CollecticonCalendarMinus,
  CollecticonFlask,
  CollecticonMedal,
  // Missing collecticons that need replacements
  CollecticonEllipsisVertical,
  CollecticonArrowDown,
  CollecticonArrowUp,
  CollecticonShare,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonChevronDown,
  CollecticonChevronUp
} from '$components/common/icons-legacy';

// Clean table styles
const tableStyles = {
  container: {
    padding: '12px',
    maxWidth: '900px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    tableLayout: 'fixed' as const
  },
  header: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  headerCell: {
    padding: '8px 12px',
    textAlign: 'left' as const,
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    borderRight: '1px solid #e5e7eb',
    width: '33.33%'
  },
  cell: {
    padding: '8px 12px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #f3f4f6',
    borderRight: '1px solid #e5e7eb',
    verticalAlign: 'middle' as const,
    width: '33.33%'
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '6px'
  },
  iconName: {
    fontWeight: '500',
    fontSize: '11px',
    color: '#6b7280',
    fontFamily: 'monospace'
  }
};

const IconRenderer = ({
  icon: IconComponent,
  iconName,
  size = 3
}: {
  icon?: React.ComponentType<Record<string, unknown>> | null;
  iconName: string;
  size?: number;
}) => (
  <div style={tableStyles.iconContainer}>
    {IconComponent ? (
      <>
        <IconComponent size={size} aria-hidden='true' />
        <span style={tableStyles.iconName}>{iconName}</span>
      </>
    ) : (
      <span style={{ ...tableStyles.iconName, color: '#6b7280' }}>-</span>
    )}
  </div>
);

const IconMigrationGuide: React.FC = () => {
  // Icon mapping data
  const iconMappings: Array<{
    collecticon: React.ComponentType<Record<string, unknown>>;
    collecticonName: string;
    uswdsIcon: React.ComponentType<Record<string, unknown>> | null;
    uswdsIconName: string;
    customIcon?: React.ComponentType<Record<string, unknown>> | null;
    customIconName?: string;
  }> = [
    {
      collecticon: CollecticonArrowRight,
      collecticonName: 'CollecticonArrowRight',
      uswdsIcon: Icon.ArrowForward,
      uswdsIconName: 'Icon.ArrowForward',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonArrowLoop,
      collecticonName: 'CollecticonArrowLoop',
      uswdsIcon: Icon.Autorenew,
      uswdsIconName: 'Icon.Autorenew',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonChartLine,
      collecticonName: 'CollecticonChartLine',
      uswdsIcon: Icon.Assessment,
      uswdsIconName: 'Icon.Assessment',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonChevronRightSmall,
      collecticonName: 'CollecticonChevronRightSmall',
      uswdsIcon: Icon.NavigateNext,
      uswdsIconName: 'Icon.NavigateNext',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonChevronDownSmall,
      collecticonName: 'CollecticonChevronDownSmall',
      uswdsIcon: Icon.ExpandMore,
      uswdsIconName: 'Icon.ExpandMore',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonCircleQuestion,
      collecticonName: 'CollecticonCircleQuestion',
      uswdsIcon: Icon.HelpOutline,
      uswdsIconName: 'Icon.HelpOutline',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonCircleXmark,
      collecticonName: 'CollecticonCircleXmark',
      uswdsIcon: Icon.HighlightOff,
      uswdsIconName: 'Icon.HighlightOff',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonCircleInformation,
      collecticonName: 'CollecticonCircleInformation',
      uswdsIcon: Icon.Info,
      uswdsIconName: 'Icon.Info',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonCompass,
      collecticonName: 'CollecticonCompass',
      uswdsIcon: Icon.NearMe,
      uswdsIconName: 'Icon.NearMe',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonExpandTopRight,
      collecticonName: 'CollecticonExpandTopRight',
      uswdsIcon: Icon.Launch,
      uswdsIconName: 'Icon.Launch',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonHamburgerMenu,
      collecticonName: 'CollecticonHamburgerMenu',
      uswdsIcon: Icon.Menu,
      uswdsIconName: 'Icon.Menu',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonMap,
      collecticonName: 'CollecticonMap',
      uswdsIcon: Icon.Map,
      uswdsIconName: 'Icon.Map',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonPage,
      collecticonName: 'CollecticonPage',
      uswdsIcon: Icon.ContactPage,
      uswdsIconName: 'Icon.ContactPage',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonTick,
      collecticonName: 'CollecticonTick',
      uswdsIcon: Icon.Check,
      uswdsIconName: 'Icon.Check',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonXmark,
      collecticonName: 'CollecticonXmark',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonXmarkSmall,
      collecticonName: 'CollecticonXmarkSmall',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonMagnifierPlus,
      collecticonName: 'CollecticonMagnifierPlus',
      uswdsIcon: Icon.ZoomIn,
      uswdsIconName: 'Icon.ZoomIn',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonMagnifierMinus,
      collecticonName: 'CollecticonMagnifierMinus',
      uswdsIcon: Icon.ZoomOut,
      uswdsIconName: 'Icon.ZoomOut',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonDrop,
      collecticonName: 'CollecticonDrop',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: DropIcon,
      customIconName: 'DropIcon'
    },
    {
      collecticon: CollecticonCalendarPlus,
      collecticonName: 'CollecticonCalendarPlus',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: CalendarPlusIcon,
      customIconName: 'CalendarPlusIcon'
    },
    {
      collecticon: CollecticonCalendarMinus,
      collecticonName: 'CollecticonCalendarMinus',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: CalendarMinusIcon,
      customIconName: 'CalendarMinusIcon'
    },
    {
      collecticon: CollecticonFlask,
      collecticonName: 'CollecticonFlask',
      uswdsIcon: Icon.Science,
      uswdsIconName: 'Icon.Science',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonMedal,
      collecticonName: 'CollecticonMedal',
      uswdsIcon: Icon.EmojiEvents,
      uswdsIconName: 'Icon.EmojiEvents',
      customIcon: null,
      customIconName: '-'
    },
    // Missing collecticons with USWDS alternatives
    {
      collecticon: CollecticonEllipsisVertical,
      collecticonName: 'CollecticonEllipsisVertical',
      uswdsIcon: Icon.MoreVert,
      uswdsIconName: 'Icon.MoreVert',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonArrowDown,
      collecticonName: 'CollecticonArrowDown',
      uswdsIcon: Icon.ArrowDownward,
      uswdsIconName: 'Icon.ArrowDownward',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonArrowUp,
      collecticonName: 'CollecticonArrowUp',
      uswdsIcon: Icon.ArrowUpward,
      uswdsIconName: 'Icon.ArrowUpward',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonShare,
      collecticonName: 'CollecticonShare',
      uswdsIcon: Icon.Share,
      uswdsIconName: 'Icon.Share',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonEyeDisabled,
      collecticonName: 'CollecticonEyeDisabled',
      uswdsIcon: Icon.VisibilityOff,
      uswdsIconName: 'Icon.VisibilityOff',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonEye,
      collecticonName: 'CollecticonEye',
      uswdsIcon: Icon.Visibility,
      uswdsIconName: 'Icon.Visibility',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonChevronDown,
      collecticonName: 'CollecticonChevronDown',
      uswdsIcon: Icon.ExpandMore,
      uswdsIconName: 'Icon.ExpandMore',
      customIcon: null,
      customIconName: '-'
    },
    {
      collecticon: CollecticonChevronUp,
      collecticonName: 'CollecticonChevronUp',
      uswdsIcon: Icon.ExpandLess,
      uswdsIconName: 'Icon.ExpandLess',
      customIcon: null,
      customIconName: '-'
    }
  ];

  return (
    <div style={tableStyles.container}>
      <h2 style={{ marginBottom: '16px', color: '#111827' }}>
        Collecticon to USWDS Migration Guide
      </h2>
      <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
        Complete mapping of collecticons to their USWDS equivalents and final
        icons for migration. The final column shows the actual icons that will
        be used in Veda UI.
      </p>

      <table style={tableStyles.table}>
        <thead style={tableStyles.header}>
          <tr>
            <th style={tableStyles.headerCell}>Collecticon</th>
            <th style={tableStyles.headerCell}>USWDS Icon</th>
            <th style={tableStyles.headerCell}>Custom Icon</th>
          </tr>
        </thead>
        <tbody>
          {iconMappings.map((mapping) => (
            <tr key={mapping.collecticonName}>
              <td style={tableStyles.cell}>
                <div style={tableStyles.iconContainer}>
                  <mapping.collecticon size='small' />
                  <span style={tableStyles.iconName}>
                    {mapping.collecticonName}
                  </span>
                </div>
              </td>
              <td style={tableStyles.cell}>
                <IconRenderer
                  icon={mapping.uswdsIcon}
                  iconName={mapping.uswdsIconName}
                />
              </td>
              <td style={tableStyles.cell}>
                <IconRenderer
                  icon={mapping.customIcon}
                  iconName={mapping.customIconName || '-'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const meta: Meta<typeof IconMigrationGuide> = {
  title: 'Icon Migration/Icon Mapping',
  component: IconMigrationGuide,
  parameters: {
    docs: {
      description: {
        component:
          'Migration guidance and icon comparison for @devseed-ui/collecticons to USWDS.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof IconMigrationGuide>;

export const Default: Story = {
  render: () => <IconMigrationGuide />
};
