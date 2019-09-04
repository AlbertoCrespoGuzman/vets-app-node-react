import React, { Component } from "react";
import CloudUpload from '@material-ui/icons/CloudUpload'

class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.state = { hightlight: false };
    this.fileInputRef = React.createRef();

    this.openFileDialog = this.openFileDialog.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  openFileDialog() {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded(evt) {
    if (this.props.disabled) return;
    const files = evt.target.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
  }

  onDragOver(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    this.setState({ hightlight: true });
  }

  onDragLeave(event) {
    this.setState({ hightlight: false });
  }

  onDrop(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    const files = event.dataTransfer.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
    this.setState({ hightlight: false });
  }

  fileListToArray(list) {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }

  render() {
    return (
      <div 
        style={{height: 200,width: 200, backgroundColor: '#fff', border: '2px dashed rgb(187, 186, 186)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection: 'column', fontSize: 16,  backgroundColor: this.state.hightlight ? 'rgb(157, 216, 255)' : '' , cursor: this.props.disabled ? "default" : "pointer"}}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
      >
        <input
          ref={this.fileInputRef}
          style={{display: 'none'}}
          type="file"
          accept="application/pdf"
          onChange={this.onFilesAdded}
        />
        <CloudUpload
          
        />
        <span>Upload Exames </span>
      </div>
    );
  }
}

export default Dropzone;