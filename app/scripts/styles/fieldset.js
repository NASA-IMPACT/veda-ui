import styled from 'styled-components';
import {
  FormFieldset,
  FormFieldsetBody,
  FormFieldsetHeader,
  FormInput
} from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';

export const FormFieldsetCompact = styled(FormFieldset)`
  background: none;
  border: none;
  margin: ${glsp(0, -1)};

  ${FormFieldsetHeader} {
    padding-left: ${glsp()};
    padding-right: ${glsp()};
  }

  ${FormFieldsetBody} {
    padding: ${glsp()};
  }
`;

export const FormFieldsetBodyColumns = styled(FormFieldsetBody)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};

  ${FormInput} {
    min-width: 0;
  }
`;
