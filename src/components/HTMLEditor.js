import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";

import {Button, Image, Modal, Select, Space} from "antd";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./AudioBlot";
import "./VideoBlot";

import {assetIdToBytesUrl} from "../utils";
import {PictureOutlined, SoundOutlined, VideoCameraOutlined} from "@ant-design/icons";

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
  "html5Audio",
  "html5Video",
];

const HTMLEditor = ({initialValue, onChange, placeholder, innerRef}) => {
  const quillRef = useRef(null);

  const [assetOptions, setAssetOptions] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [currentRange, setCurrentRange] = useState(null);

  // null | "audio" | "image" | "video"
  const [showViewer, setShowViewer] = useState(null);

  // const [showAudioViewer, setShowAudioViewer] = useState(false);
  // const [showImageViewer, setShowImageViewer] = useState(false);
  // const [showVideoViewer, setShowVideoViewer] = useState(false);

  const assets = useSelector(state => state.assets.items);

  const assetHandler = type => () => {
    setCurrentRange(quillRef.current.getEditor().getSelection(true));
    setSelectedAsset(null);
    setAssetOptions(assets.filter(a => a.asset_type === type));
    setShowViewer(type);
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
        ["link"/*, "image", "video"*/],
        ["clean"],
      ],
      // handlers: {
      //   image: imageHandler,
      //   video: videoHandler,
      // },
    },
  };

  if (initialValue === null) return <div/>;

  const modelInsertClose = () => setShowViewer(null);
  const modalInsertOk = type => () => {
    if (!quillRef.current) return;
    if (selectedAsset) {
      let data = null;
      switch (type) {
        case "image":
          data = assetIdToBytesUrl(selectedAsset);
          break;
        case "html5Audio":
        case "html5Video":
          data = {url: assetIdToBytesUrl(selectedAsset)};
          break;
      }
      quillRef.current.getEditor().insertEmbed(currentRange.index, type, data, "user");
    }
    setShowViewer(null);
  };

  // noinspection JSValidateTypes
  return <div>
    <Modal title="Insert Audio"
           visible={showViewer === "audio"}
           onOk={modalInsertOk("html5Audio")}
           onCancel={modelInsertClose}>
      <Select placeholder="Audio asset"
              onChange={asset => setSelectedAsset(asset)}
              value={selectedAsset}
              style={{width: "100%"}}
              size="large">
        {assetOptions.map(asset => <Select.Option value={asset.id} key={asset.id}>{asset.file_name}</Select.Option>)}
      </Select>
    </Modal>

    <Modal title="Insert Image"
           visible={showViewer === "image"}
           onOk={modalInsertOk("image")}
           onCancel={modelInsertClose}>
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

    <Modal title="Insert Video"
           visible={showViewer === "video"}
           onOk={modalInsertOk("html5Video")}
           onCancel={modelInsertClose}>
      <Select placeholder="Video asset"
              onChange={asset => setSelectedAsset(asset)}
              value={selectedAsset}
              style={{width: "100%"}}
              size="large">
        {assetOptions.map(asset => <Select.Option value={asset.id} key={asset.id}>{asset.file_name}</Select.Option>)}
      </Select>
    </Modal>

    <div style={{position: "relative"}}>
      <div style={{position: "absolute", top: 5, right: 16}}>
        {/* I'm too lazy to work with Quill's annoying toolbar API */}
        <Space direction="horizontal">
          <Button onClick={audioHandler} icon={<SoundOutlined />}>Audio</Button>
          <Button onClick={imageHandler} icon={<PictureOutlined />}>Image</Button>
          <Button onClick={videoHandler} icon={<VideoCameraOutlined />}>Video</Button>
        </Space>
      </div>
      <ReactQuill theme="snow"
                  ref={el => {
                    if (innerRef) {
                      if (typeof innerRef === "function") innerRef(el)
                      else innerRef.current = el;
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
