import { Toggle } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { IBanner } from '../../../types/sidebar';

class Banner extends Component<IBanner, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const {
      intl: { messages },
      optOut
    }: any = this.props;

    return (
      <Toggle
        label={messages['back to classic']}
        ariaLabel={messages['back to classic']}
        inlineLabel={true}
        defaultChecked={true}
        onText=' '
        onChange={optOut} />
    );
  }

}

// @ts-ignore
const intlBanner = injectIntl(Banner);
export default intlBanner;
