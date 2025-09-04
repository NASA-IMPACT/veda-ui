import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
import { CollecticonDrop } from '@devseed-ui/collecticons';

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
  CollecticonProgressTickHigh,
  CollecticonProgressTickMedium,
  CollecticonProgressTickLow
} from '$components/common/icons-legacy';

const IconMigrationGuide: React.FC = () => {
  // Icon mapping data
  const iconMappings = [
    {
      collecticon: CollecticonArrowRight,
      collecticonName: 'CollecticonArrowRight',
      uswdsIcon: Icon.ArrowForward,
      uswdsIconName: 'Icon.ArrowForward'
    },
    {
      collecticon: CollecticonArrowLoop,
      collecticonName: 'CollecticonArrowLoop',
      uswdsIcon: Icon.Autorenew,
      uswdsIconName: 'Icon.Autorenew'
    },
    {
      collecticon: CollecticonChartLine,
      collecticonName: 'CollecticonChartLine',
      uswdsIcon: Icon.Assessment,
      uswdsIconName: 'Icon.Assessment'
    },
    {
      collecticon: CollecticonChevronRightSmall,
      collecticonName: 'CollecticonChevronRightSmall',
      uswdsIcon: Icon.NavigateNext,
      uswdsIconName: 'Icon.NavigateNext'
    },
    {
      collecticon: CollecticonChevronDownSmall,
      collecticonName: 'CollecticonChevronDownSmall',
      uswdsIcon: Icon.ExpandMore,
      uswdsIconName: 'Icon.ExpandMore'
    },
    {
      collecticon: CollecticonCircleQuestion,
      collecticonName: 'CollecticonCircleQuestion',
      uswdsIcon: Icon.HelpOutline,
      uswdsIconName: 'Icon.HelpOutline'
    },
    {
      collecticon: CollecticonCircleXmark,
      collecticonName: 'CollecticonCircleXmark',
      uswdsIcon: Icon.HighlightOff,
      uswdsIconName: 'Icon.HighlightOff'
    },
    {
      collecticon: CollecticonCircleInformation,
      collecticonName: 'CollecticonCircleInformation',
      uswdsIcon: Icon.Info,
      uswdsIconName: 'Icon.Info'
    },
    {
      collecticon: CollecticonCompass,
      collecticonName: 'CollecticonCompass',
      uswdsIcon: Icon.NearMe,
      uswdsIconName: 'Icon.NearMe'
    },
    {
      collecticon: CollecticonExpandTopRight,
      collecticonName: 'CollecticonExpandTopRight',
      uswdsIcon: Icon.Launch,
      uswdsIconName: 'Icon.Launch'
    },
    {
      collecticon: CollecticonHamburgerMenu,
      collecticonName: 'CollecticonHamburgerMenu',
      uswdsIcon: Icon.Menu,
      uswdsIconName: 'Icon.Menu'
    },
    {
      collecticon: CollecticonMap,
      collecticonName: 'CollecticonMap',
      uswdsIcon: Icon.Map,
      uswdsIconName: 'Icon.Map'
    },
    {
      collecticon: CollecticonPage,
      collecticonName: 'CollecticonPage',
      uswdsIcon: Icon.ContactPage,
      uswdsIconName: 'Icon.ContactPage'
    },
    {
      collecticon: CollecticonTick,
      collecticonName: 'CollecticonTick',
      uswdsIcon: Icon.Check,
      uswdsIconName: 'Icon.Check'
    },
    {
      collecticon: CollecticonXmark,
      collecticonName: 'CollecticonXmark',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close'
    },
    {
      collecticon: CollecticonXmarkSmall,
      collecticonName: 'CollecticonXmarkSmall',
      uswdsIcon: Icon.Close,
      uswdsIconName: 'Icon.Close'
    },
    {
      collecticon: CollecticonMagnifierPlus,
      collecticonName: 'CollecticonMagnifierPlus',
      uswdsIcon: Icon.ZoomIn,
      uswdsIconName: 'Icon.ZoomIn'
    },
    {
      collecticon: CollecticonMagnifierMinus,
      collecticonName: 'CollecticonMagnifierMinus',
      uswdsIcon: Icon.ZoomOut,
      uswdsIconName: 'Icon.ZoomOut'
    },
    {
      collecticon: CollecticonDrop,
      collecticonName: 'CollecticonDrop',
      uswdsIcon: null,
      uswdsIconName: '-'
    },
    {
      collecticon: CollecticonCalendarPlus,
      collecticonName: 'CollecticonCalendarPlus',
      uswdsIcon: null,
      uswdsIconName: '-'
    },
    {
      collecticon: CollecticonCalendarMinus,
      collecticonName: 'CollecticonCalendarMinus',
      uswdsIcon: null,
      uswdsIconName: '-'
    },
    {
      collecticon: CollecticonFlask,
      collecticonName: 'CollecticonFlask',
      uswdsIcon: Icon.Science,
      uswdsIconName: 'Icon.Science'
    },
    {
      collecticon: CollecticonMedal,
      collecticonName: 'CollecticonMedal',
      uswdsIcon: Icon.EmojiEvents,
      uswdsIconName: 'Icon.EmojiEvents'
    },
    {
      collecticon: CollecticonProgressTickHigh,
      collecticonName: 'CollecticonProgressTickHigh',
      uswdsIcon: null,
      uswdsIconName: '-'
    },
    {
      collecticon: CollecticonProgressTickMedium,
      collecticonName: 'CollecticonProgressTickMedium',
      uswdsIcon: null,
      uswdsIconName: '-'
    },
    {
      collecticon: CollecticonProgressTickLow,
      collecticonName: 'CollecticonProgressTickLow',
      uswdsIcon: null,
      uswdsIconName: '-'
    }
  ];

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

  return (
    <div style={tableStyles.container}>
      <h2 style={{ marginBottom: '16px', color: '#111827' }}>
        Collecticon to USWDS Migration Guide
      </h2>
      <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
        Complete mapping of collecticons to their USWDS equivalents for
        migration.
      </p>

      <table style={tableStyles.table}>
        <thead style={tableStyles.header}>
          <tr>
            <th style={tableStyles.headerCell}>Collecticon</th>
            <th style={tableStyles.headerCell}>USWDS Equivalent</th>
            <th style={tableStyles.headerCell}>
              Custom Icons (No USWDS Equivalent)
            </th>
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
                <div style={tableStyles.iconContainer}>
                  {mapping.uswdsIcon ? (
                    <mapping.uswdsIcon size={3} />
                  ) : (
                    <span style={{ ...tableStyles.iconName, color: '#6b7280' }}>
                      -
                    </span>
                  )}
                  <span style={tableStyles.iconName}>
                    {mapping.uswdsIconName}
                  </span>
                </div>
              </td>
              <td style={tableStyles.cell} />
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
