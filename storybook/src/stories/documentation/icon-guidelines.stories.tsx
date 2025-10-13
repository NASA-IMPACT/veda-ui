import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
import {
  CollecticonSpeechBalloon,
  CollecticonClipboard,
  CollecticonClipboardTick,
  CollecticonPencil,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import {
  CollecticonMagnifierMinus,
  CollecticonMagnifierPlus,
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
  CollecticonFlask,
  CollecticonMedal,
  CollecticonEllipsisVertical,
  CollecticonArrowDown,
  CollecticonArrowUp,
  CollecticonShare,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonChevronDown,
  CollecticonChevronUp,
  CollecticonDrop,
  CollecticonCalendarPlus,
  CollecticonCalendarMinus
} from '$components/common/icons-legacy';
import {
  CalendarPlusIcon,
  CalendarMinusIcon,
  DropIcon
} from '$components/common/custom-icon';

// Icon Guidelines Component
const IconGuidelines: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h1>Icon Guidelines</h1>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h3>⚠️ Current Status</h3>
        <p>
          <strong>@devseed-ui/collecticons is deprecated</strong> and should no
          longer be used in new components. Existing components still rely on
          collecticons extensively and are being migrated to USWDS icons.
        </p>
      </div>

      <h2>Migration Strategy</h2>
      <p>
        We&apos;re implementing a{' '}
        <strong>gradual, component-by-component migration</strong> to avoid
        breaking changes and maintain system stability.
      </p>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h3>📋 Why Gradual Migration?</h3>
        <ul>
          <li>
            Collecticons are used in <strong>dozens of components</strong>{' '}
            across the codebase
          </li>
          <li>
            Migrating all at once would create a massive PR with high risk of
            bugs
          </li>
          <li>Allows thorough testing and maintains backward compatibility</li>
        </ul>
      </div>

      <h2>Migration Process</h2>

      <h3>1. Assess Component Dependencies</h3>
      <p>Before migrating any component, identify:</p>
      <ul>
        <li>Which collecticons the component currently uses</li>
        <li>
          Whether USWDS equivalents exist (see <strong>Icon Reference</strong>{' '}
          story)
        </li>
        <li>If custom icons need to be created</li>
        <li>Components that depend on this component</li>
      </ul>

      <h3>2. Choose Migration Path</h3>
      <p>For each collecticon, choose the appropriate replacement:</p>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <pre
          style={{
            background: '#f5f5f5',
            padding: '12px',
            overflow: 'auto',
            margin: '0'
          }}
        >
          <code>
            {`// Option A: Direct USWDS replacement
import { Icon } from '@trussworks/react-uswds';
// Replace: <CollecticonArrowRight />
// With: <Icon.ArrowForward />

// Option B: Custom icon (when no USWDS equivalent exists)  
import { DropIcon } from '$components/common/custom-icon';
// Replace: <CollecticonDrop />
// With: <DropIcon />`}
          </code>
        </pre>
      </div>

      <h3>3. Update Component</h3>
      <ul>
        <li>Replace collecticon imports with new icon imports</li>
        <li>Update JSX to use new icon components</li>
        <li>Ensure icon sizing and styling is consistent</li>
        <li>Update TypeScript types if needed</li>
      </ul>

      <h3>4. Test and Review</h3>
      <ul>
        <li>
          Create both legacy and migrated versions in the{' '}
          <strong>Migration Examples</strong> story
        </li>
        <li>Compare side-by-side for visual consistency</li>
        <li>Create PR with comparison for team review</li>
        <li>After approval, replace original and cleanup</li>
      </ul>

      <h2>Best Practices</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            border: '1px solid #ccc',
            padding: '16px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3>✅ Do&apos;s</h3>
          <ul>
            <li>
              <strong>Migrate one component at a time</strong> in focused PRs
            </li>
            <li>
              <strong>Use the Icon Reference</strong> to find correct
              replacements
            </li>
            <li>
              <strong>Test components side-by-side</strong> before submitting PR
            </li>
            <li>
              <strong>Update component stories</strong> to reflect icon changes
            </li>
            <li>
              <strong>Keep PRs focused</strong> - don&apos;t mix icon migration
              with other changes
            </li>
          </ul>
        </div>

        <div
          style={{
            border: '1px solid #ccc',
            padding: '16px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3>❌ Don&apos;ts</h3>
          <ul>
            <li>
              <strong>Don&apos;t migrate all components at once</strong> - too
              risky
            </li>
            <li>
              <strong>Don&apos;t use collecticons in new components</strong> -
              use USWDS or custom icons
            </li>
            <li>
              <strong>Don&apos;t change icon sizes arbitrarily</strong> -
              maintain visual consistency
            </li>
            <li>
              <strong>
                Don&apos;t forget to remove unused collecticon imports
              </strong>
            </li>
          </ul>
        </div>
      </div>

      <h2>Workflow Summary</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <ol>
          <li>Copy the existing component you want to migrate</li>
          <li>
            In the copy, replace collecticons with USWDS icons using the Icon
            Reference
          </li>
          <li>Add both versions to the Migration Examples for comparison</li>
          <li>Create PR with both versions side-by-side</li>
          <li>Get visual approval from team</li>
          <li>Replace original component and cleanup</li>
        </ol>
      </div>
    </div>
  );
};

// Icon Mapping Table Component
const IconMappingTable: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Icon Mapping Reference</h1>
      <p>
        Complete mapping of collecticons to their USWDS equivalents and custom
        replacements. Use this table to find the correct replacement for each
        collecticon in your components.
      </p>

      <div style={{ overflow: 'auto', margin: '20px 0' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <thead
            style={{
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <tr>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '33%',
                  color: '#374151'
                }}
              >
                Collecticon (Deprecated)
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '33%',
                  color: '#374151'
                }}
              >
                USWDS Icon (Preferred)
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  width: '33%',
                  color: '#374151'
                }}
              >
                Custom Icon (Fallback)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                collecticon: CollecticonArrowRight,
                collecticonName: 'CollecticonArrowRight',
                uswds: Icon.ArrowForward,
                uswdsName: 'Icon.ArrowForward',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonArrowLoop,
                collecticonName: 'CollecticonArrowLoop',
                uswds: Icon.Autorenew,
                uswdsName: 'Icon.Autorenew',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonChartLine,
                collecticonName: 'CollecticonChartLine',
                uswds: Icon.Assessment,
                uswdsName: 'Icon.Assessment',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonChevronRightSmall,
                collecticonName: 'CollecticonChevronRightSmall',
                uswds: Icon.NavigateNext,
                uswdsName: 'Icon.NavigateNext',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonChevronDownSmall,
                collecticonName: 'CollecticonChevronDownSmall',
                uswds: Icon.ExpandMore,
                uswdsName: 'Icon.ExpandMore',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonCircleQuestion,
                collecticonName: 'CollecticonCircleQuestion',
                uswds: Icon.HelpOutline,
                uswdsName: 'Icon.HelpOutline',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonCircleXmark,
                collecticonName: 'CollecticonCircleXmark',
                uswds: Icon.HighlightOff,
                uswdsName: 'Icon.HighlightOff',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonCircleInformation,
                collecticonName: 'CollecticonCircleInformation',
                uswds: Icon.Info,
                uswdsName: 'Icon.Info',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonCompass,
                collecticonName: 'CollecticonCompass',
                uswds: Icon.NearMe,
                uswdsName: 'Icon.NearMe',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonExpandTopRight,
                collecticonName: 'CollecticonExpandTopRight',
                uswds: Icon.Launch,
                uswdsName: 'Icon.Launch',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonHamburgerMenu,
                collecticonName: 'CollecticonHamburgerMenu',
                uswds: Icon.Menu,
                uswdsName: 'Icon.Menu',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonMap,
                collecticonName: 'CollecticonMap',
                uswds: Icon.Map,
                uswdsName: 'Icon.Map',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonPage,
                collecticonName: 'CollecticonPage',
                uswds: Icon.ContactPage,
                uswdsName: 'Icon.ContactPage',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonTick,
                collecticonName: 'CollecticonTick',
                uswds: Icon.Check,
                uswdsName: 'Icon.Check',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonXmark,
                collecticonName: 'CollecticonXmark',
                uswds: Icon.Close,
                uswdsName: 'Icon.Close',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonMagnifierPlus,
                collecticonName: 'CollecticonMagnifierPlus',
                uswds: Icon.ZoomIn,
                uswdsName: 'Icon.ZoomIn',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonMagnifierMinus,
                collecticonName: 'CollecticonMagnifierMinus',
                uswds: Icon.ZoomOut,
                uswdsName: 'Icon.ZoomOut',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonFlask,
                collecticonName: 'CollecticonFlask',
                uswds: Icon.Science,
                uswdsName: 'Icon.Science',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonMedal,
                collecticonName: 'CollecticonMedal',
                uswds: Icon.Verified,
                uswdsName: 'Icon.Verified',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonEllipsisVertical,
                collecticonName: 'CollecticonEllipsisVertical',
                uswds: Icon.MoreVert,
                uswdsName: 'Icon.MoreVert',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonArrowDown,
                collecticonName: 'CollecticonArrowDown',
                uswds: Icon.ArrowDownward,
                uswdsName: 'Icon.ArrowDownward',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonArrowUp,
                collecticonName: 'CollecticonArrowUp',
                uswds: Icon.ArrowUpward,
                uswdsName: 'Icon.ArrowUpward',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonShare,
                collecticonName: 'CollecticonShare',
                uswds: Icon.Share,
                uswdsName: 'Icon.Share',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonSpeechBalloon,
                collecticonName: 'CollecticonSpeechBalloon',
                uswds: Icon.Chat,
                uswdsName: 'Icon.Chat',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonClipboard,
                collecticonName: 'CollecticonClipboard',
                uswds: Icon.ContentCopy,
                uswdsName: 'Icon.ContentCopy',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonClipboardTick,
                collecticonName: 'CollecticonClipboardTick',
                uswds: Icon.Check,
                uswdsName: 'Icon.Check',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonPencil,
                collecticonName: 'CollecticonPencil',
                uswds: Icon.Edit,
                uswdsName: 'Icon.Edit',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonTrashBin,
                collecticonName: 'CollecticonTrashBin',
                uswds: Icon.Delete,
                uswdsName: 'Icon.Delete',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonUpload2,
                collecticonName: 'CollecticonUpload2',
                uswds: Icon.FileUpload,
                uswdsName: 'Icon.FileUpload',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonEyeDisabled,
                collecticonName: 'CollecticonEyeDisabled',
                uswds: Icon.VisibilityOff,
                uswdsName: 'Icon.VisibilityOff',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonEye,
                collecticonName: 'CollecticonEye',
                uswds: Icon.Visibility,
                uswdsName: 'Icon.Visibility',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonChevronDown,
                collecticonName: 'CollecticonChevronDown',
                uswds: Icon.ExpandMore,
                uswdsName: 'Icon.ExpandMore',
                custom: null,
                customName: '-'
              },
              {
                collecticon: CollecticonChevronUp,
                collecticonName: 'CollecticonChevronUp',
                uswds: Icon.ExpandLess,
                uswdsName: 'Icon.ExpandLess',
                custom: null,
                customName: '-'
              },
              // Custom icons
              {
                collecticon: CollecticonDrop,
                collecticonName: 'CollecticonDrop',
                uswds: null,
                uswdsName: '-',
                custom: DropIcon,
                customName: 'DropIcon'
              },
              {
                collecticon: CollecticonCalendarPlus,
                collecticonName: 'CollecticonCalendarPlus',
                uswds: null,
                uswdsName: '-',
                custom: CalendarPlusIcon,
                customName: 'CalendarPlusIcon'
              },
              {
                collecticon: CollecticonCalendarMinus,
                collecticonName: 'CollecticonCalendarMinus',
                uswds: null,
                uswdsName: '-',
                custom: CalendarMinusIcon,
                customName: 'CalendarMinusIcon'
              }
            ].map((mapping, index) => (
              <tr
                key={mapping.collecticonName || mapping.customName}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}
              >
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    {mapping.collecticon && (
                      <mapping.collecticon size='small' />
                    )}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}
                    >
                      {mapping.collecticonName}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    {mapping.uswds && <mapping.uswds size={3} />}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}
                    >
                      {mapping.uswdsName}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    verticalAlign: 'middle'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    {mapping.custom && <mapping.custom />}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}
                    >
                      {mapping.customName}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Guidelines/Icon Guidelines',
  parameters: {
    docs: {
      description: {
        component:
          'Guidelines and reference for using icons in VEDA UI. Includes migration strategy from @devseed-ui/collecticons to USWDS icons, ' +
          'comprehensive icon mapping reference, and best practices for icon usage.'
      }
    }
  }
};

export default meta;

export const Guidelines: StoryObj = {
  render: () => <IconGuidelines />
};

export const IconReference: StoryObj = {
  render: () => <IconMappingTable />
};
