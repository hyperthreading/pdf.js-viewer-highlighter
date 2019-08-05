import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import data from "./data";
import { scaledToViewport } from "./coordinates";
import styles from "./styles.module.css";
import AreaHighlight from "./highlights/AreaHighlight";

let parentWindow;
let highlights = data;
let highlightOptions = {
  arrow: "left" // left or right
};
let focusedHighlightId = null;
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
      setHighlights(action.payload);
      renderHighlights();
      break;
    case "setHighlightOptions":
      setHighlightOptions(action.payload);
      renderHighlights();
      break;
    case "scrollToHighlight":
      const id = action.payload;
      scrollToHighlight(id);
      focusedHighlightId = id;
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

// TODO:: Scroll To Certain Highlights

const setHighlights = hls => {
  highlights = hls;
};

const setHighlightOptions = opts => {
  highlightOptions = opts;
};

const scrollToHighlight = id => {
  const h = highlights.find(h => h.id === id);
  if (!h) {
    log("jump failed, highlight not found for", id);
  }
  const position = h.position;
  const pageNumber = position.pageNumber;
  const pageViewport = pdfViewer.getPageView(pageNumber - 1).viewport;
  const pdfPoint = pageViewport.convertToPdfPoint(
    0,
    scaledToViewport(position.boundingRect, pageViewport).top -
      window.innerHeight / 2
  );
  pdfViewer.scrollPageIntoView({
    pageNumber,
    destArray: [null, { name: "XYZ" }, ...pdfPoint]
  });
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
      let highlightLayer = pageView.div.querySelector(".highlightLayer");
      if (!highlightLayer) {
        highlightLayer = document.createElement("div");
        highlightLayer.setAttribute("class", "highlightLayer");
        textLayer.textLayerDiv.insertAdjacentElement(
          "beforebegin",
          highlightLayer
        );
      }

      ReactDOM.render(
        <div className={styles.highlightContainer}>
          {highlights.map(highlight => {
            return (
              <AreaHighlight
                key={highlight.id}
                isMultipleLine={
                  !Boolean(highlight.content && highlight.content.image)
                }
                position={{
                  boundingRect: scaledToViewport(
                    highlight.position.boundingRect,
                    pageView.viewport
                  ),
                  rects: highlight.position.rects.map(rect =>
                    scaledToViewport(rect, pageView.viewport)
                  )
                }}
                arrowDirection={highlightOptions.arrow}
                focused={focusedHighlightId === highlight.id}
                viewport={pageView.viewport}
                comment={highlight.comment}
                onClickArrow={() => {
                  window.parent.postMessage(
                    { type: "clickHighlight", payload: highlight },
                    "*"
                  );
                  focusedHighlightId = highlight.id;
                  renderHighlights();
                }}
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
