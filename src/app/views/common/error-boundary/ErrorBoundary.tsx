import { Label } from '@fluentui/react-components';
import React, { ReactNode, useState, useEffect } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

interface ErrorBoundaryChildProps {
  onError: () => void;
}

function ErrorBoundary(props: Props) {
  const [state, setState] = useState<State>({ hasError: false });

  useEffect(() => {
    setState({ hasError: false });
  }, [props.children]);

  const handleError = () => {
    setState({ hasError: true });
  };

  if (state.hasError) {
    return <Label>{translateMessage('Something went wrong')}</Label>;
  } else {
    return (
      <React.Fragment>
        {React.Children.map(props.children, (child) => {
          return React.cloneElement(child as React.ReactElement<ErrorBoundaryChildProps>, { onError: handleError });
        })}
      </React.Fragment>
    );
  }
}

export default ErrorBoundary;
