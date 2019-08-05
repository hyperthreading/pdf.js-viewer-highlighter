import React, { Component, useCallback, useState } from "react";
import cn from "classnames";
import styles from "../styles.module.css";

import ArrowLeft from "../assets/hl-arrow-left.svg";
import ArrowRight from "../assets/hl-arrow-right.svg";

const AreaHighlight = ({
  position,
  viewport,
  onClickArrow,
  isMultipleLine,
  arrowDirection,
  onMouseOver,
  onMouseOut,
  comment,
  isScrolledTo,
  onDoubleClick
}) => {
  const { boundingRect } = position;

  const [showHighlight, setShowHighlight] = useState(false);

  const onMouseEnter = useCallback(() => {
    setShowHighlight(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setShowHighlight(false);
  }, []);

  const isOnRight = boundingRect.left + boundingRect.width > viewport.width / 2;

  const highlighting = isMultipleLine ? (
    position.rects.map((rect, index) => (
      <div
        key={index}
        style={rect}
        className={cn([
          styles.highlightBox,
          styles.line,
          showHighlight ? null : styles.hidden
        ])}
      />
    ))
  ) : (
    <div
      className={cn([
        styles.highlightBox,
        styles.area,
        showHighlight ? null : styles.hidden
      ])}
      style={boundingRect}
    />
  );

  let Arrow = arrowDirection === "left" ? ArrowLeft : ArrowRight;

  return (
    <div className={styles.highlightOffset}>
      {highlighting}
      <Arrow
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClickArrow}
        className={cn(styles.arrowRight)}
        style={{
          top: boundingRect.top,
          left: isOnRight ? viewport.width - 10 : -22
        }}
      />
    </div>
  );
};

export default AreaHighlight;
