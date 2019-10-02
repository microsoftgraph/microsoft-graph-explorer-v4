import { MessageBar, MessageBarType, Toggle } from 'office-ui-fabric-react';
import React from 'react';

interface IBanner {
  optOut: Function;
}

export const Banner = ({ optOut }: IBanner) => {
  return (
    <div className='row'>
      <MessageBar styles={{
        icon: {
          fontSize: '30px',
          float: 'right',
        }
      }}>
        <Toggle
          label='You are using Graph Explorer in preview. Switch the toggle to go back to Graph Explorer classic'
          inlineLabel={true}
          defaultChecked={true}
          onText=' '
          onChange={() => optOut()} />
      </MessageBar>
    </div>
  );
};
