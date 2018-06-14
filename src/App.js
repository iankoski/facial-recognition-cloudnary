import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';

const CLOUDINARY_UPLOAD_PRESET = 'pcn832mt';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dboynfiuq/upload';


function main(params) {
  return new Promise(function (resolve, reject) {
    var res = {};

    const VisualRecognitionV3 =
      require('watson-developer-cloud/visual-recognition/v3');

    var url = params.url || 'https://gateway-a.watsonplatform.net/visual-recognition/api' ;
    var use_unauthenticated =  params.use_unauthenticated || false ;

    const visual_recognition = new VisualRecognitionV3({
      'api_key': WvHNLuwaif7blre0UAXx1ISojkQEiHl_Lr5szhZHENJY,
      'version_date': '2018-03-19',
      'url' : url,
      'use_unauthenticated': use_unauthenticated
    });

    visual_recognition.detectFaces({'url': params.imageurl}, function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
} 


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }


 defaultParameters = {
  'api_key': 'WvHNLuwaif7blre0UAXx1ISojkQEiHl_Lr5szhZHENJY',
  'imageurl': 'this.state.uploadedFileCloudinaryUrl',
  'url' : 'https://sandbox-watson-proxy.mybluemix.net/visual-recognition/api',
  'use_unauthenticated' : true
}

if (require.main === module)
  main(defaultParameters)
    .then((results) => console.log(JSON.stringify(results, null, 2)))
    .catch((error) => console.log(error.message));

  render() {
    return (
      <form>
        <div className="FileUpload">
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={false}
            accept="image/*">
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} />
          </div>}
        </div>
      </form>

    )
  }
}
