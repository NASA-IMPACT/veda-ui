import React from 'react';
import { datasets } from 'veda';
import Block from '$components/common/blocks';

import { ContentBlockProse } from '$styles/content-block';

export default function SandboxMDXPage() {
  const data = datasets['no2'].data.layers[0];
  const layerInfoMdxContent = data.info?.description;
  const layerInfoTable = data.info.table;

  return layerInfoMdxContent ? (
    <Block>
      <ContentBlockProse>
        <h2>{data.name} Layer Info</h2>
        <div dangerouslySetInnerHTML={{ __html: layerInfoMdxContent }} />
        <ul>
          {Object.keys(layerInfoTable).map((key) => {
            return (
              <li key={key}>
                <b>{key} : </b> <span>{layerInfoTable[key]}</span>
              </li>
            );
          })}
        </ul>
      </ContentBlockProse>
    </Block>
  ) : (
    <div> Cannot find layer info fron dataset no2</div>
  );
}
