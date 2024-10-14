// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useEffect} from "react";

const TGCPreviewContent = ({children}) => {
  useEffect(() => {
    document.querySelectorAll("tgcs-audio").forEach(el => {
      el.addEventListener("click", () => {
        const audio = el.querySelector("audio");
        if (audio.paused) { audio.play().catch(console.error); }
        else { audio.load(); }
      });
    });
  }, [children]);

  return <div className="tgc-preview--content">{children}</div>;
};

export default TGCPreviewContent;
