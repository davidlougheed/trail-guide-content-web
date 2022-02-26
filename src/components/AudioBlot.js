import {Quill} from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class AudioBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value.url);
    node.setAttribute("controls", "controls");
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
    };
  }
}

AudioBlot.blotName = "html5Audio";
AudioBlot.tagName = "audio";

Quill.register("formats/html5Audio", AudioBlot);
