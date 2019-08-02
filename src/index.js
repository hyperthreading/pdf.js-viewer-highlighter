import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import data from "./data";
import { scaledToViewport } from "./coordinates";
import styles from "./styles.module.css";
import AreaHighlight from "./highlights/AreaHighlight";

let parentWindow;
let highlights = data;
let pdfViewer;

let initialized = false;

const log = (...args) => {
  console.log("[highlighter]", ...args);
};

const onMessage = e => {
  log("message", e);

  const action = e.data;
  switch (action.type) {
    case "register":
      parentWindow = e.source;
      parentWindow.postMessage({ type: "registered" }, "*");
      break;
    case "getHighlights":
      parentWindow.postMessage(
        { type: "highlights", payload: highlights },
        "*"
      );
      break;
    case "setHighlights":
      highlights = action.payload;
      renderHighlights();
      break;
    case "focus":
      document.body.focus();
      break;
    case "render":
      renderHighlights();
      break;
    default:
      log("unknown message", e);
  }
};

// 언제 렌더링을 해야 하는가.
// textLayer가 있을 때.
let renderHighlights = () => {
  if (!initialized) {
    return;
  }

  // DO something
  log("Rendering highlights");
  _.toPairs(_.groupBy(highlights, h => h.position.pageNumber)).forEach(
    ([pageNumber, highlights]) => {
      const pageView = pdfViewer.getPageView(Number(pageNumber) - 1);
      const textLayer = pageView.textLayer;

      // TODO:: textLayer가 왜 null일까
      if (!textLayer) return;

      textLayer.textLayerDiv.style.overflow = "visible";
      let highlightLayer = pageView.div.querySelector(
        ".highlightLayer"
      );
      if (!highlightLayer) {
        highlightLayer = document.createElement("div");
        highlightLayer.setAttribute("class", "highlightLayer");
        textLayer.textLayerDiv.insertAdjacentElement('beforebegin', highlightLayer);
      }

      ReactDOM.render(
        <div className={styles.highlightContainer}>
          {highlights.map(highlight => {
            return (
              <AreaHighlight
                position={{
                  boundingRect: scaledToViewport(
                    highlight.position.boundingRect,
                    pageView.viewport
                  ),
                  rects: highlight.position.rects.map(rect =>
                    scaledToViewport(rect, pageView.viewport)
                  )
                }}
                viewport={pageView.viewport}
                comment={highlight.comment}
              />
            );
          })}
        </div>,
        highlightLayer
      );
    }
  );
};
renderHighlights = _.debounce(renderHighlights, 66);

const initialize = () => {
  window.addEventListener("message", onMessage);
  window.addEventListener("focus", () => {
    window.parent.postMessage({ type: "focus" }, "*");
  });
  window.addEventListener("blur", () => {
    window.parent.postMessage({ type: "blur" }, "*");
  });

  // wait for textLayer where highlights are rendered
  // eventBusDispatchToDOM from AppOption must be set true
  document.addEventListener("textlayerrendered", () => {
    pdfViewer = window.PDFViewerApplication.pdfViewer;
    initialized = true;
    log("text loaded");

    // just make sure highlights are rendered after being initialized
    renderHighlights();
  });

  log("init");
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
