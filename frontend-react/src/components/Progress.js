import React, { Component } from "react";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style ={{width: '87%', height: 8, backgroundColor:'#3863ff', borderRadius: 5,marginRight: 15, marginTop: 5, float: 'right'}}>
        <div style={{ backgroundColor: '#3d67fd', height: '100%',  margin: 0, borderRadius: 5, width: this.props.progress + "%" }}
        />
      </div>
    );
  }
}

export default Progress;