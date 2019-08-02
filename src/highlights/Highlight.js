import React, { Component } from 'react';

import styles from '../styles.module.css';

class Highlight extends Component {
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

    const { rects, boundingRect } = position;

    return (
      <div
        className={styles.highlightOffset}
      >
        {comment ? (
          <div
            className={styles.Highlight__emoji}
            style={{
              left: 20,
              top: boundingRect.top
            }}
          >
            {comment.emoji}
          </div>
        ) : null}
        <div className={styles.Highlight__parts}>
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              onDoubleClick={onDoubleClick}
              key={index}
              style={rect}
              className={styles.Highlight__parte}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
