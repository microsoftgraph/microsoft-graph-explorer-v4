import { SearchBox } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

const ResourceExplorer = () => {

  const [resources, setResources] = useState([]);

  const searchValueChanged = (event: any, value?: string) => {
    let resourceItems = resources;
    if (value) {
      const keyword = value.toLowerCase();
      resourceItems = resources.filter((sample: any) => {
        const name = sample.url.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }
    setResources(resourceItems);
  }

  return (
    <section>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={searchValueChanged}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />

    </section>
  )
}

export default ResourceExplorer;
