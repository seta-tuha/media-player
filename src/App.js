import React, { Component } from 'react';
import ReactCroppie from './ReactCroppie';
import MediaWrapper from './media/MediaWrapper';
import AudioPlayer from './media/AudioPlayer';

class App extends Component {
  state = {
    url: "https://c1.staticflickr.com/4/3677/13545844805_1fe22f9631_k.jpg",
    croppieStyle: null,
    videoUrl: "M7lc1UVf-VE",
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
    console.log(videoUrl)
    return (
      <div className="App">
        {/* <ReactCroppie
          url={url}
          ref="cropper"
          croppieStyle={croppieStyle}
          croppieOptions={{ showZoomer: false }}
        />
        <button onClick={this.crop}>crop</button> */}
        <MediaWrapper url={videoUrl} videoEl={this.refs.youtubePlayer} type="youtube" >
          <div ref="youtubePlayer" />
          <AudioPlayer />
        </MediaWrapper>
        <br />
        <button onClick={() => this.setState({ videoUrl: 'ZWzEh1Y9x7A'})}>change video</button>
      </div>
    );
  }
}
// https://adtima-video-te-vnso-zn-1.zadn.vn/2019/01/9d6e5f53-891c-4159-bb53-5fc0361e3b17.mp4

// https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/2059bdfc67b88ee6d7a9/2253874714638220055?authen=exp=1548383992~acl=/2059bdfc67b88ee6d7a9/*~hmac=7cf26c47052fab41a094ceb5fddf5c27

export default App;
