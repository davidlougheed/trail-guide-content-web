import {Quill} from "react-quill";

const Embed = Quill.import("blots/embed");

class AudioBlot extends Embed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value.url);

    const audio = document.createElement("audio");
    audio.setAttribute("src", value.url);

    if (value.linkText) {
      node.setAttribute("data-link-text", value.linkText);
      node.addEventListener("click", () => {
        if (audio.paused) { audio.play().catch(console.error); }
        else { audio.load(); }
      });
    } else {
      node.setAttribute("controls", "controls");
      audio.setAttribute("controls", "controls");
    }

    node.appendChild(audio);

    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
      linkText: node.getAttribute("data-link-text") || undefined,
    };
  }
}

AudioBlot.blotName = "tgcsAudio";
AudioBlot.tagName = "tgcs-audio";

Quill.register("formats/tgcsAudio", AudioBlot);
