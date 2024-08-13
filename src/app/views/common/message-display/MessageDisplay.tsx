
import { GRAPH_URL } from '../../../services/graph-constants';
import { JSXBuilder } from './JSXBuilder';

interface MessageDisplay {
  message: string;
  onSetQuery?: (link: string) => void;
}

const parseStringToJSX = ({ input, onClick }: { input: string; onClick: (link: string) => void }): JSX.Element => {
  const builder = new JSXBuilder();

  let lastIndex = 0;

  // Regular expression to match bold text enclosed in **
  const boldPattern = /\*\*(.*?)\*\*/g;
  input.replace(boldPattern, (match, boldText, index) => {
    builder.addText(input.slice(lastIndex, index));
    builder.addBoldText(boldText);
    lastIndex = index + match.length;
    return '';
  });

  // Handle [label](url) pattern
  const linkPattern = /\[([^\]]+?)\]\(([^)]+?)\)/g;
  input.replace(linkPattern, (match, label, url, index) => {
    builder.addText(input.slice(lastIndex, index));
    builder.addLink({ label, url, onClick: url.includes(GRAPH_URL) ? onClick : undefined });
    lastIndex = index + match.length;
    return '';
  });

  // Handle standalone URLs
  const standaloneUrlPattern = /(?:^|\s)(https?:\/\/\S+)(?!\S)/g;
  input.replace(standaloneUrlPattern, (match, url, index) => {
    builder.addText(input.slice(lastIndex, index));
    builder.addText(' ');
    builder.addLink({ label: url, url, onClick: url.includes(GRAPH_URL) ? onClick : undefined });
    lastIndex = index + match.length;
    return '';
  });

  if (lastIndex < input.length) {
    builder.addText(input.slice(lastIndex));
  }

  return builder.build();

};

const messageDisplay = (props: MessageDisplay) => {
  const { message, onSetQuery } = props;

  const onLinkClick = (url: string) => {
    onSetQuery && onSetQuery(url);
  };

  return parseStringToJSX({
    input: message,
    onClick: onLinkClick
  });
}

export default messageDisplay