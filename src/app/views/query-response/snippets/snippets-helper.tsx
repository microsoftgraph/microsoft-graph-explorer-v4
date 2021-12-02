import { IconButton, IIconProps, Label, PivotItem } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';

import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import { IRootState } from '../../../../types/root';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { translateMessage } from '../../../utils/translate-messages';

interface ISnippetProps {
  language: string;
}

export function renderSnippets(supportedLanguages: string[]) {
  return supportedLanguages.map((language: string) => (
    <PivotItem
      key={language}
      headerText={language}
    >
      <Snippet language={language} />
    </PivotItem>
  ));
}

function Snippet(props: ISnippetProps) {
  let { language } = props;

  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
   *
   * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
   * a lowercase string for the param value.
   */
  language = language.toLowerCase();

  const sampleQuery = useSelector((state: IRootState) => state.sampleQuery, shallowEqual);
  const { dimensions: { response }, snippets, responseAreaExpanded } = useSelector((state: IRootState) => state);
  const { data, pending: loadingState } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;
  const [copied, setCopied] = useState(false);

  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 140);

  const dispatch = useDispatch();

  const copyIcon: IIconProps = {
    iconName: !copied ? 'Copy' : 'CheckMark'
  };

  const handleCopy = async () => {
    trackedGenericCopy(snippet, CODE_SNIPPETS_COPY_BUTTON, sampleQuery,{ Language: language });
    setCopied(true);
    handleTimeout();
  }

  const handleTimeout = () => {
    const timer = setTimeout(() => { setCopied(false) }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [sampleQuery.sampleUrl]);

  return (
    <div style={{ display: 'block' }}>
      {loadingState &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Fetching code snippet' />...
        </Label>
      }
      {!loadingState && snippet &&
        <>
          <IconButton
            toggle
            style={{ float: 'right', zIndex: 1 }}
            title={ !copied ? translateMessage('Copy') : translateMessage('Copied')}
            ariaLabel={ !copied ? translateMessage('Copy') : translateMessage('Copied')}
            iconProps={ copyIcon }
            onClick={handleCopy}
          />
          <Monaco
            body={snippet}
            language={language}
            readOnly={true}
            height={height}
          />
        </>
      }
      {!loadingState && !snippet &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Snippet not available' />
        </Label>
      }
    </div>
  );
}
