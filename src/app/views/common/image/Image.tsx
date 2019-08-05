import React, { Component } from 'react';
import { IImageComponentProps, IImageComponentState } from '../../../../types/image';

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
      try {
        const buffer = await body.clone().arrayBuffer();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        this.setState({ imageUrl });
      } catch (error) {
        return null;
      }
    }
  }

  public render() {
    const { imageUrl } = this.state;
    const { styles, alt } = this.props;

    return (
      <img style={styles} src={imageUrl} alt={alt} />
    );
  }
}
