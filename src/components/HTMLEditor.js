import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";

import {Button, Checkbox, Image, Input, Modal, Select, Space} from "antd";

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
  "tgcsAudio",
  "html5Video",
];

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

  // null | "audio" | "image" | "video"
  const [showViewer, setShowViewer] = useState(null);

  const assets = useSelector(state => state.assets.items);

  const assetHandler = type => () => {
    setCurrentRange(quillRef.current.getEditor().getSelection(true));
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
        ["link"],
        ["clean"],
      ],
    },
  };

  if (initialValue === null) return <div/>;

  const modelInsertClose = () => setShowViewer(null);
  const modalInsertOk = type => data => {
    if (!quillRef.current) return;
    if (!data) return;
    quillRef.current.getEditor().insertEmbed(currentRange.index, type, data, "user");
    setShowViewer(null);
  };

  // noinspection JSValidateTypes
  return <div>
    <AudioModal assetOptions={assetOptions}
                visible={showViewer === "audio"}
                onOk={modalInsertOk("tgcsAudio")}
                onCancel={modelInsertClose} />

    <ImageModal assetOptions={assetOptions}
                visible={showViewer === "image"}
                onOk={modalInsertOk("image")}
                onCancel={modelInsertClose} />

    <VideoModal assetOptions={assetOptions}
                visible={showViewer === "video"}
                onOk={modalInsertOk("html5Video")}
                onCancel={modelInsertClose} />

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
