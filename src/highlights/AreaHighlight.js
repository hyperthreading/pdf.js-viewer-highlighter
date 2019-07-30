import React, { Component } from "react";
import cn from "classnames";
import styles from "./styles.module.css";

class AreaHighlight extends Component {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      comment,
      isScrolledTo,
      onDoubleClick
    } = this.props;

    const { boundingRect } = position;

    return (
      <div className={styles.highlightOffset}>
        <div className={cn(styles.area)} style={boundingRect}/>
      </div>
    );
  }
}

export default AreaHighlight;
