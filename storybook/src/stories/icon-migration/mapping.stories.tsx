import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
import {
  ArrowForward,
  Assessment,
  Autorenew,
  CalendarMinus,
  CalendarPlus,
  Check,
  Close,
  ContactPage,
  Drop,
  EmojiEvents,
  ExpandMore,
  HelpOutline,
  HighlightOff,
  Info,
  Launch,
  Map,
  Menu,
  NavigateNext,
  NearMe,
  Science,
  ZoomIn,
  ZoomOut
} from '$components/common/icons';

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
  CollecticonMedal
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
  icon?: React.ComponentType<any> | null;
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
    collecticon: React.ComponentType<any>;
    collecticonName: string;
    uswdsIcon: React.ComponentType<any> | null;
    uswdsIconName: string;
    customIcon?: React.ComponentType<any>;
    customIconName?: string;
  }> = [
    {
      collecticon: CollecticonArrowRight,
      collecticonName: 'CollecticonArrowRight',
      uswdsIcon: Icon.ArrowForward,
      uswdsIconName: 'Icon.ArrowForward',
      customIcon: ArrowForward,
      customIconName: 'ArrowForward'
    },
    {
      collecticon: CollecticonArrowLoop,
      collecticonName: 'CollecticonArrowLoop',
      uswdsIcon: Icon.Autorenew,
      uswdsIconName: 'Icon.Autorenew',
      customIcon: Autorenew,
      customIconName: 'Autorenew'
    },
    {
      collecticon: CollecticonChartLine,
      collecticonName: 'CollecticonChartLine',
      uswdsIcon: Icon.Assessment,
      uswdsIconName: 'Icon.Assessment',
      customIcon: Assessment,
      customIconName: 'Assessment'
    },
    {
      collecticon: CollecticonChevronRightSmall,
      collecticonName: 'CollecticonChevronRightSmall',
      uswdsIcon: Icon.NavigateNext,
      uswdsIconName: 'Icon.NavigateNext',
      customIcon: NavigateNext,
      customIconName: 'NavigateNext'
    },
    {
      collecticon: CollecticonChevronDownSmall,
      collecticonName: 'CollecticonChevronDownSmall',
      uswdsIcon: Icon.ExpandMore,
      uswdsIconName: 'Icon.ExpandMore',
      customIcon: ExpandMore,
      customIconName: 'ExpandMore'
    },
    {
      collecticon: CollecticonCircleQuestion,
      collecticonName: 'CollecticonCircleQuestion',
      uswdsIcon: Icon.HelpOutline,
      uswdsIconName: 'Icon.HelpOutline',
      customIcon: HelpOutline,
      customIconName: 'HelpOutline'
    },
    {
      collecticon: CollecticonCircleXmark,
      collecticonName: 'CollecticonCircleXmark',
      uswdsIcon: Icon.HighlightOff,
      uswdsIconName: 'Icon.HighlightOff',
      customIcon: HighlightOff,
      customIconName: 'HighlightOff'
    },
    {
      collecticon: CollecticonCircleInformation,
      collecticonName: 'CollecticonCircleInformation',
      uswdsIcon: Icon.Info,
      uswdsIconName: 'Icon.Info',
      customIcon: Info,
      customIconName: 'Info'
    },
    {
      collecticon: CollecticonCompass,
      collecticonName: 'CollecticonCompass',
      uswdsIcon: Icon.NearMe,
      uswdsIconName: 'Icon.NearMe',
      customIcon: NearMe,
      customIconName: 'NearMe'
    },
    {
      collecticon: CollecticonExpandTopRight,
      collecticonName: 'CollecticonExpandTopRight',
      uswdsIcon: Icon.Launch,
      uswdsIconName: 'Icon.Launch',
      customIcon: Launch,
      customIconName: 'Launch'
    },
    {
      collecticon: CollecticonHamburgerMenu,
      collecticonName: 'CollecticonHamburgerMenu',
      uswdsIcon: Icon.Menu,
      uswdsIconName: 'Icon.Menu',
      customIcon: Menu,
      customIconName: 'Menu'
    },
    {
      collecticon: CollecticonMap,
      collecticonName: 'CollecticonMap',
      uswdsIcon: Icon.Map,
      uswdsIconName: 'Icon.Map',
      customIcon: Map,
      customIconName: 'Map'
    },
    {
      collecticon: CollecticonPage,
      collecticonName: 'CollecticonPage',
      uswdsIcon: Icon.ContactPage,
      uswdsIconName: 'Icon.ContactPage',
      customIcon: ContactPage,
      customIconName: 'ContactPage'
    },
    {
      collecticon: CollecticonTick,
      collecticonName: 'CollecticonTick',
      uswdsIcon: Icon.Check,
      uswdsIconName: 'Icon.Check',
      customIcon: Check,
      customIconName: 'Check'
    },
    {
      collecticon: CollecticonXmark,
      collecticonName: 'CollecticonXmark',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close',
      customIcon: Close,
      customIconName: 'Close'
    },
    {
      collecticon: CollecticonXmarkSmall,
      collecticonName: 'CollecticonXmarkSmall',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close',
      customIcon: Close,
      customIconName: 'Close'
    },
    {
      collecticon: CollecticonMagnifierPlus,
      collecticonName: 'CollecticonMagnifierPlus',
      uswdsIcon: Icon.ZoomIn,
      uswdsIconName: 'Icon.ZoomIn',
      customIcon: ZoomIn,
      customIconName: 'ZoomIn'
    },
    {
      collecticon: CollecticonMagnifierMinus,
      collecticonName: 'CollecticonMagnifierMinus',
      uswdsIcon: Icon.ZoomOut,
      uswdsIconName: 'Icon.ZoomOut',
      customIcon: ZoomOut,
      customIconName: 'ZoomOut'
    },
    {
      collecticon: CollecticonDrop,
      collecticonName: 'CollecticonDrop',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: Drop,
      customIconName: 'Drop'
    },
    {
      collecticon: CollecticonCalendarPlus,
      collecticonName: 'CollecticonCalendarPlus',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: CalendarPlus,
      customIconName: 'CalendarPlus'
    },
    {
      collecticon: CollecticonCalendarMinus,
      collecticonName: 'CollecticonCalendarMinus',
      uswdsIcon: null,
      uswdsIconName: '-',
      customIcon: CalendarMinus,
      customIconName: 'CalendarMinus'
    },
    {
      collecticon: CollecticonFlask,
      collecticonName: 'CollecticonFlask',
      uswdsIcon: Icon.Science,
      uswdsIconName: 'Icon.Science',
      customIcon: Science,
      customIconName: 'Science'
    },
    {
      collecticon: CollecticonMedal,
      collecticonName: 'CollecticonMedal',
      uswdsIcon: Icon.EmojiEvents,
      uswdsIconName: 'Icon.EmojiEvents',
      customIcon: EmojiEvents,
      customIconName: 'EmojiEvents'
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
            <th style={tableStyles.headerCell}>Veda UI Icon</th>
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
