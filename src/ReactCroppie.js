import React, { Component } from 'react';
import Croppie from 'croppie';
import 'croppie/croppie.css';

class ReactCroppie extends Component {
  onUpdateCroppie = (event) => {
    this.props.onUpdateCroppie && this.props.onUpdateCroppie(event.detail);
  }

  crop = (options) => {
    return this.croppie.result(options)
  }

  render() {
    const { croppieClass = "", croppieStyle = {} } = this.props;
    return <div ref="croppieEl" className={croppieClass} style={croppieStyle} />
  }

  componentDidMount() {
    const { croppieOptions } = this.props;
    this.croppie = new Croppie(this.refs.croppieEl, croppieOptions);
    this.croppie.bind({
      url: this.props.url
    })
    this.refs.croppieEl.addEventListener('update', this.onUpdateCroppie);
  }

  componentDidUpdate(prevProps) {
    const { url: prevUrl } = prevProps;
    const { url } = this.props;
    if (url !== prevUrl) {
      this.croppie.bind({
        url
      })
    }
  }

  componentWillUnmount() {
    this.refs.croppieEl.removeEventListener('update', this.onUpdateCroppie);
  }
}

export default ReactCroppie;
