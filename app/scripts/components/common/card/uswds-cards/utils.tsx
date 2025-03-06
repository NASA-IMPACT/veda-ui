import React from 'react';
import { LabelType } from './types';
import { Tags } from '$components/common/tags';
import Collection from '$components/common/svgs/collection';

const mapper = {
  data_collection: {
    title: 'Data Collection',
    svg: <Collection size='sm' />
  },
  story: {
    title: 'Story',
    svg: <Collection size='sm' /> // TO BE REPLACED
  }
};

export const createCardLabel = (type: LabelType): JSX.Element => {
  const item = mapper[type];

  return <Tags icon={item.svg} items={[item.title]} />;
};
