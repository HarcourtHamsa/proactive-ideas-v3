import React from "react";
import { createPortal } from "react-dom";

type RootElem = Element | DocumentFragment;

function ReactPortal({ children }: { children: React.ReactNode }) {
  const rootElem = document.getElementById("portal-root") as RootElem;
  return createPortal(children, rootElem);
}

export default ReactPortal;
