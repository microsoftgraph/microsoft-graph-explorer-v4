import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Label, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import templates from '../../../../graph-toolkit-examples';
import { IQuery } from '../../../../types/query-runner';
import { parseSampleUrl } from '../../../utils/sample-url-generation';

class GraphToolkit extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  public lookupToolkitUrl = (sampleQuery: IQuery): any => {
    if (sampleQuery) {
      const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
      const query = '/' + requestUrl + search;
      for (const templateMapKey in templates) {
        if (templates.hasOwnProperty(templateMapKey)) {
          const isMatch = new RegExp(templateMapKey + '$', 'i').test(query);
          if (isMatch) {
            const url: string = (templates as any)[templateMapKey];
            let { search: componentUrl } = parseSampleUrl(url);
            componentUrl = componentUrl.replace('?id=', '');
            return {
              exampleUrl: `https://mgt.dev/?path=/story/${componentUrl}`,
              toolkitUrl: url
            };
          }
        }
      }

    }
    return { toolkitUrl: null, exampleUrl: null };
  }

  public render() {
    const { sampleQuery } = this.props;
    const { toolkitUrl, exampleUrl } = this.lookupToolkitUrl(sampleQuery);

    if (toolkitUrl) {
      return (
        <>
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id='Open this example in' />
            <a
              tabIndex={0}
              href={exampleUrl} target='_blank'>
               <FormattedMessage id='graph toolkit playground' />
            </a>.
          </MessageBar>
          <iframe width='100%' height='470px' src={toolkitUrl} />
        </>
      );
    }

    return (
      <Label style={{
        display: 'flex',
        width: '100%',
        minHeight: '470px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <FormattedMessage id='We did not find a Graph toolkit for this query' /> <a
          tabIndex={0}
          href='https://aka.ms/mgt' target='_blank'>
          <FormattedMessage id='Learn more about the Microsoft Graph Toolkit' />.
          </a>
      </Label>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery
  };
}

export default connect(mapStateToProps, null)(GraphToolkit);
