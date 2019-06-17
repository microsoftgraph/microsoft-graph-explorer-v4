import React, { Component } from 'react';

interface IImageComponentProps {
  body: any;
  styles: any;
}

interface IImageComponentState {
  imageUrl: string;
}

/**
 * TODO: Support custom styles
 */
export class Image extends Component<IImageComponentProps, IImageComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imageUrl: '',
    };
  }

  public async componentDidMount() {
    const { body } = this.props;

    if (body) {
      const buffer = await body.clone().arrayBuffer();
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      this.setState({ imageUrl });
    }
  }

  public render() {
    const { imageUrl } = this.state;
    const { styles } = this.props;

    return (
      <img style={styles} src={imageUrl} />
    );
  }
}
