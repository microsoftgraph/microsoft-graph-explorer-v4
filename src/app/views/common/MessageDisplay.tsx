import { Link } from '@fluentui/react';
import { Fragment } from 'react';

import { GRAPH_URL } from '../../services/graph-constants';
import {
  convertArrayToObject, extractUrl, getMatchesAndParts,
  matchIncludesLink, replaceLinks
} from '../../utils/status-message';

interface MessageDisplay {
  message: string;
  onSetQuery?: (link: string) => void;
}

const messageDisplay = (props: MessageDisplay) => {
  const { message, onSetQuery } = props;
  let displayMessage = message;

  let urls: { [key: string]: string } = {};
  const extractedUrls = extractUrl(message);
  if (extractedUrls) {
    displayMessage = replaceLinks(message);
    urls = convertArrayToObject(extractedUrls);
  }
  const { matches, parts } = getMatchesAndParts(displayMessage);

  if (!parts || !matches || !urls || Object.keys(urls).length === 0) {
    return displayMessage;
  }

  return parts.map((part: string, index: number) => {
    const displayLink = (): React.ReactNode => {
      const link = urls[part];
      if (link) {
        if (link.includes(GRAPH_URL)) {
          return <Link onClick={() => onSetQuery && onSetQuery(link)} underline>{link}</Link>;
        }
        return <Link target='_blank' href={link} underline>{link}</Link>;
      }
    };

    return (
      <Fragment key={part + index}>{matchIncludesLink(matches, part) ?
        displayLink() : part}
      </Fragment>
    );
  })
}

export default messageDisplay