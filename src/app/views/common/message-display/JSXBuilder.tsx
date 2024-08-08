import { FontWeights, IStyle, ITheme, Link, getTheme } from '@fluentui/react';
import { Fragment } from 'react';

import { queryResponseStyles } from '../../query-response/queryResponse.styles';

export class JSXBuilder {
  private elements: JSX.Element[] = [];

  addText(text: string) {
    this.elements.push(<Fragment key={this.elements.length}>{text}</Fragment>);
    return this;
  }

  addLink({ label, url, onClick }: { label: string; url: string; onClick?: (url: string) => void; }) {
    const currentTheme: ITheme = getTheme();
    const linkStyle = queryResponseStyles(currentTheme).link as IStyle;

    this.elements.push(
      <Link
        styles={{ root: linkStyle }}
        underline
        key={this.elements.length}

        onClick={onClick ? () => onClick(url) : undefined}
        target={!onClick ? '_blank' : undefined}
        href={!onClick ? url : undefined}
      >
        {label}
      </Link>
    );
    return this;
  }

  addBoldText(text: string) {
    this.elements.push(
      <span style={{ fontWeight: FontWeights.bold }}
        key={this.elements.length}>{text}
      </span>
    );
    return this;
  }

  build() {
    return <>{this.elements}</>;
  }
}
