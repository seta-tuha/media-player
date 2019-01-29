import React, { Component } from 'react';
import ReactCroppie from './ReactCroppie';
import SimplePlayer from './media/SimplePlayer';
import Wrapper from './media/Wrapper';
import audioPlayer from './media/audioPlayer';
import youtubePlayer from './media/youtubePlayer';

const audioUrl = "https://vnno-vn-6-tf-mp3-s1-zmp3.zadn.vn/4bdfb211b3555a0b0344/6856346999886316522?authen=exp=1548817102~acl=/4bdfb211b3555a0b0344/*~hmac=0c339aa23fda4671a0ecddef68c13ee4"
class App extends Component {
  state = {
    url: "https://c1.staticflickr.com/4/3677/13545844805_1fe22f9631_k.jpg",
    croppieStyle: null,
    videoUrl: "ssVvkfcL9HI",
  }

  crop = () => {
    this.refs.cropper.crop()
      .then(croppieBlob => {
        this.setState({
          url: croppieBlob
        });
        URL.revokeObjectURL(this.state.url);
      })
  }

  getCroppieStyle(url) {
    const croppieImage = new Image();
    return new Promise((resolve) => {
      croppieImage.onload = () => {
        resolve({
          height: 300,
          width: croppieImage.naturalWidth / croppieImage.naturalHeight * 300,
          borderRadius: 10
        })
      }
      croppieImage.src = url;
    })
  }

  componentDidMount() {
    this.getCroppieStyle(this.state.url)
      .then(croppieStyle =>  this.setState({ croppieStyle }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { url: prevUrl } = prevState;
    const { url } = this.state;
    if (url !== prevUrl) {
      this.getCroppieStyle(url)
        .then(croppieStyle =>  this.setState({ croppieStyle }));
    }
  }


  render() {
    const { url, croppieStyle, videoUrl } = this.state;
    return (
      <div className="App">
        <ReactCroppie
          url={url}
          ref="cropper"
          croppieStyle={croppieStyle}
          croppieOptions={{ showZoomer: false }}
        />
        <button onClick={this.crop}>crop</button>
        <br />
        <div>Youtube player</div>
        <Wrapper url={videoUrl} mediaEl={youtubePlayer} >
          <SimplePlayer />
        </Wrapper>
        <button onClick={() => this.setState({ videoUrl: 'Sv6dMFF_yts'})}>change video</button>
        <div>Audio player</div>
        <Wrapper url={audioUrl} mediaEl={audioPlayer} >
          <SimplePlayer />
        </Wrapper>
        <br />
      </div>
    );
  }
}

export default App;
