import {Quill} from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class VideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value.url);
    node.setAttribute("controls", "controls");
    // node.setAttribute('preload', 'none');
    node.setAttribute("width", 480);
    node.setAttribute("height", 270);
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
      // width: node.getAttribute('width'),
      // height: node.getAttribute('height')
    };
  }
}

VideoBlot.blotName = "html5Video";
VideoBlot.tagName = "video";

Quill.register("formats/html5Video", VideoBlot);
