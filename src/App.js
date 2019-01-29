import React, { Component } from 'react';
import ReactCroppie from './ReactCroppie';
import MediaWrapper from './media/MediaWrapper';
import AudioPlayer from './media/AudioPlayer';
import Wrapper from './media/Wrapper';
import audioPlayer from './media/getAudioPlayer';
import youtubePlayer from './media/getYoutubePlayer';

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
    // console.log(videoUrl)
    return (
      <div className="App">
        {/* <ReactCroppie
          url={url}
          ref="cropper"
          croppieStyle={croppieStyle}
          croppieOptions={{ showZoomer: false }}
        />
        <button onClick={this.crop}>crop</button> */}
        {/* <MediaWrapper url={videoUrl} videoEl={this.refs.youtubePlayer} type="youtube" >
          <div ref="youtubePlayer" />
          <AudioPlayer />
        </MediaWrapper> */}
        <Wrapper url={videoUrl} mediaEl={youtubePlayer} >
          <AudioPlayer />
        </Wrapper>
        {/* <Wrapper url={'https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/8605e64aec0e05505c1f/7233897931381552945?authen=exp=1548771267~acl=/8605e64aec0e05505c1f/*~hmac=f863ad06b94832cb1bd83d93d5ba7aa4'} mediaEl={audioPlayer} >
          <AudioPlayer />
        </Wrapper> */}
        <br />
        <button onClick={() => this.setState({ videoUrl: 'Sv6dMFF_yts'})}>change video</button>
      </div>
    );
  }
}
// https://adtima-video-te-vnso-zn-1.zadn.vn/2019/01/9d6e5f53-891c-4159-bb53-5fc0361e3b17.mp4

// https://vnno-zn-5-tf-mp3-s1-zmp3.zadn.vn/2059bdfc67b88ee6d7a9/2253874714638220055?authen=exp=1548383992~acl=/2059bdfc67b88ee6d7a9/*~hmac=7cf26c47052fab41a094ceb5fddf5c27

export default App;
