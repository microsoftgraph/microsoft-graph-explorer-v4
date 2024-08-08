import { FontWeights, Link } from '@fluentui/react';
import { Fragment } from 'react';

export class JSXBuilder {
  private elements: JSX.Element[] = [];

  addText(text: string) {
    this.elements.push(<Fragment key={this.elements.length}>{text}</Fragment>);
    return this;
  }

  addLink({ label, url, onClick }: { label: string; url: string; onClick?: (url: string) => void; }) {
    this.elements.push(
      onClick ?
        <Link key={this.elements.length} onClick={() => onClick(url)} underline>
          {label}
        </Link> : <Link key={this.elements.length} target='_blank' href={url} underline>
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
