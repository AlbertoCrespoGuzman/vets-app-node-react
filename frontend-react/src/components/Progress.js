import React, { Component } from "react";
import styles from "./css/Progress.css";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.ProgressBar}>
        <div
          className={styles.Progress}
          style={{ width: this.props.progress + "%" }}
        />
      </div>
    );
  }
}

export default Progress;