import { SearchBox } from '@fluentui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { translateMessage } from '../../../utils/translate-messages';

const ResourceExplorer = () => {
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const { data } = resources;
  const [resourceItems, setResourceItems] = useState<IResource[]>(data.children);
  const searchValueChanged = (event: any, value?: string) => {
    const items = [...resourceItems];
    let filtered: any[] = items;
    if (value) {
      const keyword = value.toLowerCase();
      filtered = items.filter((sample: IResource) => {
        const name = sample.segment.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }
    setResourceItems(filtered);
  }

  return (
    <section>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={searchValueChanged}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      {JSON.stringify(resourceItems, null, 4)}

    </section>
  )
}

export default ResourceExplorer;
