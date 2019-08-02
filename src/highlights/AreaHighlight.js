import React, { Component, useCallback, useState } from "react";
import cn from "classnames";
import styles from "../styles.module.css";

import ArrowRight from "../assets/hl-arrow-right.svg";

const AreaHighlight = ({
  position,
  viewport,
  onClick,
  onMouseOver,
  onMouseOut,
  comment,
  isScrolledTo,
  onDoubleClick
}) => {
  const { boundingRect } = position;

  const [ showHighlight, setShowHighlight ] = useState(false);

  const onMouseEnter = useCallback(() => {
    setShowHighlight(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setShowHighlight(false);
  }, []);

  const isOnRight = (boundingRect.left + boundingRect.width > (viewport.width / 2));

  return (
    <div className={styles.highlightOffset}>
      <div className={cn([styles.area, showHighlight ? null : styles.hideArea])} style={boundingRect}>
      </div>
      <ArrowRight
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(styles.arrowRight)}
        style={{ top: boundingRect.top, left: isOnRight ? viewport.width - 10 : -22 }}
      />
    </div>
  );
};

export default AreaHighlight;
