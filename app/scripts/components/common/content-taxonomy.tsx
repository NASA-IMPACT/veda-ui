import React from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import { Link } from 'react-router-dom';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading, Overline } from '@devseed-ui/typography';

import { CatalogActions } from '$components/common/catalog/utils';

import { variableGlsp } from '$styles/variable-utils';
import { Pill } from '$styles/pill';

const TaxonomySection = styled.section`
  grid-column: 1 / -1;
  margin-left: ${variableGlsp(-1)};
  margin-right: ${variableGlsp(-1)};
  padding: ${variableGlsp(1, 1, 0, 1)};
  box-shadow: 0 -1px 0 0 ${themeVal('color.surface-200a')};
`;

const TaxonomyList = styled.dl`
  grid-column: 1 / -1;
  display: flex;
  flex-flow: row wrap;
  gap: ${glsp(0.5)};
  align-items: center;

  > dd {
    display: flex;
    flex-flow: row wrap;
    gap: ${glsp(0.5)};
    margin-right: ${glsp(0.5)};
  }
`;

interface ContentTaxonomyProps {
  taxonomy: Taxonomy[];
  linkBase: string;
}

export function ContentTaxonomy(props: ContentTaxonomyProps) {
  const { taxonomy, linkBase } = props;

  if (!taxonomy.length) return null;

  return (
    <TaxonomySection>
      <Heading as='h2' hidden>
        Taxonomy
      </Heading>
      <TaxonomyList>
        {taxonomy.map(({ name, values }) => (
          <React.Fragment key={name}>
            <dt>
              <Overline variation='surface-400a'>{name}</Overline>
            </dt>
            <dd>
              {values.map((t) => (
                <Pill
                  variation='achromic'
                  key={t.id}
                  as={Link}
                  to={`${linkBase}?${CatalogActions.TAXONOMY}=${encodeURIComponent(
                    JSON.stringify({ [name]: [t.id] })
                  )}`}
                >
                  {t.name}
                </Pill>
              ))}
            </dd>
          </React.Fragment>
        ))}
      </TaxonomyList>
    </TaxonomySection>
  );
}
