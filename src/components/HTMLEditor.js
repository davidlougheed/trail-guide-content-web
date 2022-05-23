import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";

import {Button, Checkbox, Divider, Image, Input, Modal, Select, Space} from "antd";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./AudioBlot";
import "./VideoBlot";

import {assetIdToBytesUrl} from "../utils";
import {
  CloseSquareOutlined, 
  PictureOutlined, 
  SoundOutlined, 
  VideoCameraOutlined
} from "@ant-design/icons";
import {APP_BASE_URL} from "../config";

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "tgcsAudio",
  "html5Video",
];

// cool name :)
const ModalModal = ({modalOptions, linkText, onOk, onCancel, visible}) => {
  // const [linkText, setLinkText] = useState(initialLinkText);
  const [selectedModal, setSelectedModal] = useState(null);
  
  // useEffect(() => {
  //   setLinkText(initialLinkText);
  // }, [initialLinkText]);
  
  const onOk_ = () => {
    onOk({
      // linkText,
      url: `${APP_BASE_URL}/modals/${selectedModal}`
    });
  };
  
  // noinspection JSValidateTypes
  return <Modal title="Insert Modal Link" onOk={onOk_} onCancel={onCancel} visible={visible}>
    <Space direction="vertical" style={{width: "100%"}}>
      <div>
        <strong>Link text:</strong> {linkText}
        {/*<Input placeholder="Link text" value={linkText} onChange={e => setLinkText(e.target.value)} />*/}
      </div>
      <div>
        <Select placeholder="Modal" 
                onChange={modalId => setSelectedModal(modalId)} 
                value={selectedModal}
                style={{width: "100%"}} 
                size="large">
          {modalOptions.map(modal => 
            <Select.Option value={modal.id} key={modal.id}>{modal.title}</Select.Option>)}
        </Select>
      </div>
    </Space>
  </Modal>;
};

const AudioModal = ({assetOptions, onOk, onCancel, visible}) => {
  const [displayAsLink, setDisplayAsLink] = useState(false);
  const [linkText, setLinkText] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = () => {
    if (!selectedAsset) return;
    onOk({
      url: assetIdToBytesUrl(selectedAsset),
      linkText: linkText || undefined,
    });
    setSelectedAsset(null);
  };

  // noinspection JSValidateTypes
  return (
    <Modal title="Insert Audio" onOk={onOk_} onCancel={onCancel} visible={visible}>
      <Space direction="vertical" style={{width: "100%"}}>
        <div>
          <Checkbox checked={displayAsLink} onChange={e => setDisplayAsLink(e.target.checked)}>
            Display as link</Checkbox>
        </div>
        <div>
          <Input placeholder="Link text"
                 disabled={!displayAsLink}
                 value={displayAsLink ? linkText : ""}
                 onChange={e => setLinkText(e.target.value)} />
        </div>
        <div>
          <Select placeholder="Audio asset"
                  onChange={asset => setSelectedAsset(asset)}
                  value={selectedAsset}
                  style={{width: "100%"}}
                  size="large">
            {assetOptions.map(asset => <Select.Option value={asset.id} key={asset.id}>
              {asset.file_name}</Select.Option>)}
          </Select>
        </div>
      </Space>
    </Modal>
  );
};

const ImageModal = ({assetOptions, onOk, onCancel, visible}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = () => {
    if (!selectedAsset) return;
    onOk(assetIdToBytesUrl(selectedAsset));
    setSelectedAsset(null);
  };

  // noinspection JSValidateTypes
  return (
    <Modal title="Insert Image" visible={visible} onOk={onOk_} onCancel={onCancel}>
      <Select placeholder="Image asset"
              onChange={asset => setSelectedAsset(asset)}
              value={selectedAsset}
              style={{width: "100%"}}
              size="large">
        {assetOptions.map(asset => (
          <Select.Option value={asset.id} key={asset.id}>
            <Image src={assetIdToBytesUrl(asset.id)} height={40}/>
            <span style={{marginLeft: 8, verticalAlign: "top"}}>{asset.file_name}</span>
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

const VideoModal = ({assetOptions, onOk, onCancel, visible}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = () => {
    if (!selectedAsset) return;
    onOk({url: assetIdToBytesUrl(selectedAsset)});
    setSelectedAsset(null);
  };

  // noinspection JSValidateTypes
  return (
    <Modal title="Insert Video" visible={visible} onOk={onOk_} onCancel={onCancel}>
      <Select placeholder="Video asset"
              onChange={asset => setSelectedAsset(asset)}
              value={selectedAsset}
              style={{width: "100%"}}
              size="large">
        {assetOptions.map(asset => <Select.Option value={asset.id} key={asset.id}>{asset.file_name}</Select.Option>)}
      </Select>
    </Modal>
  );
};

const HTMLEditor = ({initialValue, onChange, placeholder, innerRef}) => {
  const quillRef = useRef(null);

  const [assetOptions, setAssetOptions] = useState([]);
  const [currentRange, setCurrentRange] = useState(null);
  const [currentSelection, setCurrentSelection] = useState("");

  // null | "modal" | "audio" | "image" | "video"
  const [showViewer, setShowViewer] = useState(null);

  const assets = useSelector(state => state.assets.items);
  const modals = useSelector(state => state.modals.items);

  const assetHandler = type => () => {
    setCurrentRange(quillRef.current.getEditor().getSelection(true));
    setAssetOptions(assets.filter(a => a.asset_type === type));
    setShowViewer(type);
  };
  
  const modalHandler = () => {
    const sel = quillRef.current.getEditor().getSelection(true);
    if (!sel || !sel.length) {
      // TODO: Toast
      alert("No text selected.");
      return;
    }
    setCurrentRange(sel);
    setCurrentSelection(quillRef.current.getEditor().getText(sel.index, sel.length));
    setShowViewer("modal");
  };

  /** @type {(function(): void)} */
  const audioHandler = assetHandler("audio");
  /** @type {(function(): void)} */
  const imageHandler = assetHandler("image");
  /** @type {(function(): void)} */
  const videoHandler = assetHandler("video");

  const modules = {
    toolbar: {
      container: [
        [{"header": [1, 2, 3, false]}],
        ["bold", "italic", "underline"],
        [{"list": "ordered"}, {"list": "bullet"}],
        ["link"],
        ["clean"],
      ],
    },
  };

  if (initialValue === null) return <div/>;

  const modalInsertClose = () => setShowViewer(null);
  const modalInsertOk = type => data => {
    if (!quillRef.current) return;
    if (!data) return;
    if (type === "link") {
      // quillRef.current.getEditor().deleteText(currentRange.index, currentRange.length);
      // quillRef.current.getEditor().formatText(currentRange.index, data.linkText, type, data.url, "user");
      quillRef.current.getEditor().formatText(currentRange.index, currentRange.length, type, data.url, "user");
    } else {
      quillRef.current.getEditor().insertEmbed(currentRange.index, type, data, "user");
    }
    modalInsertClose();
  };

  // noinspection JSValidateTypes
  return <div>
    <ModalModal modalOptions={modals}
                linkText={currentSelection}
                visible={showViewer === "modal"} 
                onOk={modalInsertOk("link")} onCancel={modalInsertClose} />
    
    <AudioModal assetOptions={assetOptions}
                visible={showViewer === "audio"}
                onOk={modalInsertOk("tgcsAudio")}
                onCancel={modalInsertClose} />

    <ImageModal assetOptions={assetOptions}
                visible={showViewer === "image"}
                onOk={modalInsertOk("image")}
                onCancel={modalInsertClose} />

    <VideoModal assetOptions={assetOptions}
                visible={showViewer === "video"}
                onOk={modalInsertOk("html5Video")}
                onCancel={modalInsertClose} />

    <div style={{position: "relative"}}>
      <div style={{position: "absolute", top: 5, right: 16}}>
        {/* I'm too lazy to work with Quill's annoying toolbar API */}
        <Space direction="horizontal">
          <Button onClick={modalHandler} icon={<CloseSquareOutlined />}>Modal</Button>
          <Divider type="vertical" style={{margin: "0 6px"}} />
          <Button onClick={audioHandler} icon={<SoundOutlined />}>Audio</Button>
          <Button onClick={imageHandler} icon={<PictureOutlined />}>Image</Button>
          <Button onClick={videoHandler} icon={<VideoCameraOutlined />}>Video</Button>
        </Space>
      </div>
      <ReactQuill theme="snow"
                  ref={el => {
                    if (innerRef) {
                      if (typeof innerRef === "function") { innerRef(el); }
                      else { innerRef.current = el; }
                    }
                    quillRef.current = el;
                  }}
                  formats={FORMATS}
                  modules={modules}
                  defaultValue={initialValue}
                  onChange={onChange}
                  placeholder={placeholder}/>
    </div>
  </div>;
};

export default HTMLEditor;
