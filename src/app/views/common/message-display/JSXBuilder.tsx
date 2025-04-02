import { Link } from '@fluentui/react-components';
import { Fragment } from 'react';

export class JSXBuilder {
  private elements: JSX.Element[] = [];

  addText(text: string) {
    this.elements.push(
      <Fragment key={this.elements.length}>{text}</Fragment>
    );
    return this;
  }

  addLink({ label, url, onClick }: { label: string; url: string; onClick?: (url: string) => void; }) {
    this.elements.push(
      <Link
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
      <span style={{ fontWeight: 'bold' }} key={this.elements.length}>
        {text}
      </span>
    );
    return this;
  }

  build() {
    return <>{this.elements}</>;
  }
}
