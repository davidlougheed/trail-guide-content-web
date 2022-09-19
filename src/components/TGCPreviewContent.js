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
