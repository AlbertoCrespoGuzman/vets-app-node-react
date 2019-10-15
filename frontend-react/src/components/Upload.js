import React, { Component } from 'react'
import styles from './css/Upload.css'
import Dropzone from './Dropzone'
import Progress from "./Progress";
import CheckCircle from '@material-ui/icons/CheckCircle'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import PdfIcon from '@material-ui/icons/PictureAsPdf'
import EditIcon from '@material-ui/icons/Edit'
import { ListItem, List } from '@material-ui/core';
import dotenv from 'dotenv'
dotenv.config()

class Upload extends Component {
    constructor(props) {
      super(props);
      this.state = {
        files: [],
        uploading: false,
        uploadProgress: {},
        successfullUploaded: false
      };
  
      this.onFilesAdded = this.onFilesAdded.bind(this);
      this.uploadFiles = this.uploadFiles.bind(this);
      this.sendRequest = this.sendRequest.bind(this);
      this.renderActions = this.renderActions.bind(this);
      this.sendRequest = this.sendRequest.bind(this)
    }
    componentDidMount(){
      console.log(this.props)
      console.log(JSON.stringify(styles))
    }
    onFilesAdded(files) {
      this.setState(prevState => ({
        files: prevState.files.concat(files)
      }));
    }
  
    async uploadFiles() {
      this.setState({ uploadProgress: {}, uploading: true });
      const promises = [];
      this.state.files.forEach(file => {
        promises.push(this.sendRequest(file));
      });
      try {
        await Promise.all(promises);
  
        this.setState({ successfullUploaded: true, uploading: false });
      } catch (e) {
        // Not Production ready! Do some error handling here instead...
        this.setState({ successfullUploaded: true, uploading: false });
      }
    }
  
    sendRequest(file) {
      
        return new Promise((resolve, reject) => {
            
      
          const data = new FormData()
          data.append('userId', this.props.data.userId)
          data.append('displayName', this.props.data.displayName)
          data.append('commentsEnabled', this.props.data.commentsEnabled)
          data.append('adminId', this.props.admin._id)
          data.append('file', file)
          data.append('files', this.state.files)
          data.append('size', file.size)
        console.log('fileee', JSON.stringify(file))
          for (var key of data.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
          const ttthis = this
          axios({
              method: 'post',
              url: process.env.REACT_APP_API_HOST + '/api/files',
              data: data,
              config: { headers: {'Content-Type': 'multipart/form-data' }},
              onUploadProgress: ProgressEvent => {
                    if(ProgressEvent.loaded === ProgressEvent.total*100){
                      const copy = { ...this.state.uploadProgress };
                      copy[file.name] = { state: "done", percentage: 100 };
                      this.setState({ uploadProgress: copy })
                    }else{
                      const copy = { ...this.state.uploadProgress };
                      copy[file.name] = {
                        state: "pending",
                        percentage: (ProgressEvent.loaded / ProgressEvent.total) * 100
                      };
                      this.setState({ uploadProgress: copy });
                    }
                }
              })
              .then(function (response) {
                  const copy = { ...ttthis.state.uploadProgress };
                  copy[file.name] = { state: "done", percentage: 100 };
                  ttthis.setState({ uploadProgress: copy })
                  ttthis.props.triggerUploadedFinished()
                  console.log(response);
              })
              .catch(function (response) {
                  //handle error
                  console.log(JSON.stringify(response.response))
              });
  
  
        });
      


    }
  
    renderProgress(file) {
      const uploadProgress = this.state.uploadProgress[file.name];
      console.log('renderProgress', uploadProgress)
      if (this.state.uploading || this.state.successfullUploaded) {
        return (
          <div className={styles.ProgressWrapper}>
            <Progress progress={uploadProgress ? uploadProgress.percentage : 0} style={{float: 'right'}}/>
            <CheckCircle
              
              style={{
                opacity: uploadProgress && uploadProgress.state === "done" ? 0.5 : 0,
                float: 'left',
                marginLeft: 10

              }}
            />
          </div>
        );
      }
    }
  
    renderActions() {
      if (this.state.successfullUploaded) {
        return (
          <Button
            onClick={() =>
              this.setState({ files: [], successfullUploaded: false })
            }
          >
            Limpar
          </Button>
        );
      } else {
        return (
          <Button
            disabled={this.state.files.length < 0 || this.state.uploading}
            onClick={this.uploadFiles}
          >
            Fazer Upload
          </Button>
        );
      }
    }
  
    render() {
      return (
        <div className={styles.Upload} style={{padding: 20}}>
          <div style={{display: 'flex', flexDirection: 'row', paddingTop: '16px', boxSizing: 'border-box', width: '100%'}}>
            <div>
              <Dropzone
                onFilesAdded={this.onFilesAdded}
                disabled={this.state.uploading || this.state.successfullUploaded}
              />
            </div>
            <div style={{marginLeft: 32, alignItems: 'flex-start', justifyItems: 'flex-start', flex: 1,overflowY: 'auto'}}>
              <List>
                    <ListItem >
                    <PersonIcon style={{float: 'left', color: '#2a2a2a', marginRight: 5}}/>
                    <Typography 
                        variant="subtitle1" style={{float: 'left', color: '#2a2a2a'}}>
                        Arquivo para: {this.props.data.user.completename}
                    </Typography>
                      </ListItem>
                    <ListItem >
                    <EditIcon style={{float: 'left', color: '#2a2a2a', marginRight: 5}}/>
                    <Typography 
                        variant="subtitle1" style={{float: 'left', color: '#2a2a2a'}}>
                        Nome do Arquivo: {this.props.data.displayName.length > 0 ? this.props.data.displayName : 'Manter nome original do Arquivo'} 
                    </Typography>
                      </ListItem>
                  </List>
              {this.state.files.map(file => {
                return (
                  <div key={file.name} className={styles.Row}>
                  
                    <ListItem >
                    <PdfIcon style={{float: 'left', color: '#2a2a2a', marginRight: 5}}/>
                    <Typography 
                        variant="subtitle1" style={{float: 'left', color: '#2a2a2a'}}>
                        {file.name}
                    </Typography>
                      </ListItem>
                   
                    < br/>
                    {this.renderProgress(file)}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{display: 'flex', flex: 1, width: '100%', alignItems: 'flex-end' , flexDirection: 'column', marginTop: 32}}>
            {this.renderActions()}</div>
        </div>
      );
    }
  }
  
  export default Upload;