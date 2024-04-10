import React from 'react';
import styled from 'styled-components';
import { FormGroupStructure, FormCheckableGroup,  FormCheckable} from '@devseed-ui/form';
import { CollecticonChevronDown, CollecticonChevronUp } from '@devseed-ui/collecticons';

interface CheckableFiltersProps {
  title: string;
  items: string[];
}

const FilterMenu = styled.div`

`;

export default function CheckableFilters(props: CheckableFiltersProps) {
  const {items, title} = props;
  const [show, setShow] = React.useState<boolean>(true);

  return (
    <FilterMenu>
      <h3>{title}</h3>
      {
        show ? 
          <CollecticonChevronUp />
          : 
          <CollecticonChevronDown />
      }
      {
        show && (
          <FormGroupStructure label='' id=''>
            <FormCheckableGroup>
              {
                items.map((item) => {
                  return (
                    <FormCheckable
                      key={item}
                      value={item}
                      onChange={() => true}
                      checked={undefined}
                      type='checkbox'
                      name={item}
                      id={item}
                    >
                      {item}
                    </FormCheckable>
                  );
                })
              }
            </FormCheckableGroup>
          </FormGroupStructure>
        )
      }

    </FilterMenu>

  );
}