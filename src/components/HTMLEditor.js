import React, {useCallback, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";

import {Button, Checkbox, Divider, Image, Input, Modal, Select, Space, Tooltip} from "antd";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./AudioBlot";
import "./VideoBlot";

import {assetIdToBytesUrl} from "../utils";
import {
  CloseSquareOutlined,
  FileOutlined,
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

const filterOption = (v, option) =>
  (option.search ?? option.value).toLocaleLowerCase().includes(v.toLocaleLowerCase());

const LinkModal = React.memo(({options, objectName, objectPathItem, linkText, onOk, onCancel, visible}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const onOk_ = useCallback(
    () => {
      if (!selectedItem) return;
      onOk(`${APP_BASE_URL}/${objectPathItem}/${selectedItem}`);
      setSelectedItem(null);
    },
    [objectPathItem, selectedItem, onOk]);

  const mappedOptions = useMemo(() => options.map(item => ({
    label: item.title,
    value: item.id,
    search: item.title,
  })), [options]);
  
  // noinspection JSValidateTypes
  return <Modal title={`Insert ${objectName} Link`} onOk={onOk_} onCancel={onCancel} visible={visible}>
    <Space direction="vertical" style={{width: "100%"}}>
      <div><strong>Link text:</strong> {linkText}</div>
      <div>
        <Select
          placeholder={objectName}
          showSearch={true}
          filterOption={filterOption}
          onChange={itemId => setSelectedItem(itemId)}
          value={selectedItem}
          style={{width: "100%"}}
          size="large"
          options={mappedOptions}
        />
      </div>
    </Space>
  </Modal>;
});

const AudioModal = React.memo(({assetOptions, onOk, onCancel, visible}) => {
  const [displayAsLink, setDisplayAsLink] = useState(false);
  const [linkText, setLinkText] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = useCallback(() => {
    if (!selectedAsset) return;
    onOk({
      url: assetIdToBytesUrl(selectedAsset),
      linkText: linkText || undefined,
    });
    setSelectedAsset(null);
  }, [selectedAsset, onOk]);

  const options = useMemo(() => assetOptions.map(asset => ({
    label: asset.file_name,
    value: asset.id,
    search: asset.file_name,
  })), [assetOptions]);

  // noinspection JSValidateTypes
  return <Modal title="Insert Audio" onOk={onOk_} onCancel={onCancel} visible={visible}>
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
        <Select
          placeholder="Audio asset"
          showSearch={true}
          filterOption={filterOption}
          onChange={asset => setSelectedAsset(asset)}
          value={selectedAsset}
          style={{width: "100%"}}
          size="large"
          options={options}
        />
      </div>
    </Space>
  </Modal>;
});

const ImageModal = React.memo(({assetOptions, onOk, onCancel, visible}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = useCallback(() => {
    if (!selectedAsset) return;
    onOk(assetIdToBytesUrl(selectedAsset));
    setSelectedAsset(null);
  }, [selectedAsset, onOk]);

  const options = useMemo(() => assetOptions.map(asset => ({
    label: <div>
      <Image src={assetIdToBytesUrl(asset.id)} height={40}/>
      <span style={{marginLeft: 8, verticalAlign: "top"}}>{asset.file_name}</span>
    </div>,
    value: asset.id,
    search: asset.file_name,
  })), [assetOptions]);

  // noinspection JSValidateTypes
  return <Modal title="Insert Image" visible={visible} onOk={onOk_} onCancel={onCancel}>
    <Select
      placeholder="Image asset"
      showSearch={true}
      filterOption={filterOption}
      onChange={asset => setSelectedAsset(asset)}
      value={selectedAsset}
      style={{width: "100%"}}
      size="large"
      options={options}
    />
  </Modal>;
});

const VideoModal = React.memo(({assetOptions, onOk, onCancel, visible}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = useCallback(() => {
    if (!selectedAsset) return;
    onOk({url: assetIdToBytesUrl(selectedAsset)});
    setSelectedAsset(null);
  }, [selectedAsset, onOk]);

  const options = useMemo(() => assetOptions.map(asset => ({
    label: asset.file_name,
    value: asset.id,
    search: asset.file_name,
  })), [assetOptions]);

  // noinspection JSValidateTypes
  return <Modal title="Insert Video" visible={visible} onOk={onOk_} onCancel={onCancel}>
    <Select
      placeholder="Video asset"
      showSearch={true}
      filterOption={filterOption}
      onChange={asset => setSelectedAsset(asset)}
      value={selectedAsset}
      style={{width: "100%"}}
      size="large"
      options={options}
    />
  </Modal>;
});

const HTMLEditor = ({initialValue, onChange, placeholder, innerRef}) => {
  const quillRef = useRef(null);

  const [assetOptions, setAssetOptions] = useState([]);
  const [currentRange, setCurrentRange] = useState(null);
  const [currentSelection, setCurrentSelection] = useState("");

  // null | "modal" | "audio" | "image" | "video"
  const [showViewer, setShowViewer] = useState(null);

  const assets = useSelector(state => state.assets.items);
  const modals = useSelector(state => state.modals.items);
  const pages = useSelector(state => state.pages.items);

  const assetHandler = type => () => {
    setCurrentRange(quillRef.current.getEditor().getSelection(true));
    setAssetOptions(assets.filter(a => a.asset_type === type));
    setShowViewer(type);
  };
  
  const linkHandler = type => () => {
    const sel = quillRef.current.getEditor().getSelection(true);
    if (!sel || !sel.length) {
      // TODO: Toast
      alert("No text selected.");
      return;
    }

    setCurrentRange(sel);
    setCurrentSelection(quillRef.current.getEditor().getText(sel.index, sel.length));
    setShowViewer(type);
  };

  /** @type {(function(): void)} */
  const modalHandler = linkHandler("modal");
  /** @type {(function(): void)} */
  const pageHandler = linkHandler("page");

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

  const modalInsertClose = useCallback(() => setShowViewer(null), []);
  const modalInsertOk = type => data => {
    if (!quillRef.current) return;
    if (!data) return;
    if (type === "link") {
      quillRef.current.getEditor().formatText(currentRange.index, currentRange.length, type, data, "user");
    } else {
      quillRef.current.getEditor().insertEmbed(currentRange.index, type, data, "user");
    }
    modalInsertClose();
  };

  // noinspection JSValidateTypes
  return <div>
    <LinkModal objectName="Modal"
               objectPathItem="modals"
               options={modals}
               linkText={currentSelection}
               visible={showViewer === "modal"}
               onOk={modalInsertOk("link")}
               onCancel={modalInsertClose} />

    <LinkModal objectName="Page"
               objectPathItem="pages"
               options={pages}
               linkText={currentSelection}
               visible={showViewer === "page"}
               onOk={modalInsertOk("link")}
               onCancel={modalInsertClose} />
    
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
          <Button onClick={pageHandler} icon={<FileOutlined />}>Page</Button>
          <Divider type="vertical" style={{margin: "0 6px"}} />
          <Tooltip title="Audio">
            <Button onClick={audioHandler} icon={<SoundOutlined />} />
          </Tooltip>
          <Tooltip title="Image">
              <Button onClick={imageHandler} icon={<PictureOutlined />} />
          </Tooltip>
          <Tooltip title="Video">
            <Button onClick={videoHandler} icon={<VideoCameraOutlined />} />
          </Tooltip>
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
