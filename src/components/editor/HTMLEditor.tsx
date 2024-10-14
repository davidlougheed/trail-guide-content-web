import React, {CSSProperties, useCallback, useMemo, useRef, useState} from "react";

import {Button, Checkbox, Divider, Image, Input, Modal, Select, Space, Tooltip} from "antd";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {helpText as helpTextStyle} from "../../styles";

import "./AudioBlot";
import "./DividerBlot";
import "./VideoBlot";

import {assetIdToBytesUrl} from "../../utils";
import {
  CloseSquareOutlined,
  EnvironmentOutlined,
  FileOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {APP_BASE_URL} from "../../config";
import {useAppSelector} from "../../hooks";
import {Asset} from "../../modules/assets/types";
import {AssetType} from "../../modules/asset_types/types";
import {useStations} from "../../modules/stations/hooks";

const styles: {[key: string]: CSSProperties} = {
  modalFormSpace: {width: "100%"},
  modalFormSelect: {width: "100%"},

  imageOptionText: {marginLeft: 8, verticalAlign: "top"},

  editorContainer: {position: "relative"},
  extraToolbar: {position: "absolute", top: 5, right: 16},
  extraToolbarDivider: {margin: "0 6px"},
};

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
  "divider",
];

const filterOption = (v: string, option: {search?: string, value: string}) =>
  (option.search ?? option.value).toLocaleLowerCase().includes(v.toLocaleLowerCase());

type LinkModalProps = {
  options: ({id: string; title: string})[];
  objectName: string;
  objectPathItem: string;
  linkText: string;
  onOk: (link: string) => void;
  onCancel: () => void;
  open: boolean;
};

const LinkModal = React.memo(
  ({options, objectName, objectPathItem, linkText, onOk, onCancel, open}: LinkModalProps) => {
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
    return <Modal title={`Insert ${objectName} Link`} onOk={onOk_} onCancel={onCancel} open={open}>
      <Space direction="vertical" style={styles.modalFormSpace}>
        <div><strong>Link text:</strong> {linkText}</div>
        <div>
          <Select
            placeholder={objectName}
            showSearch={true}
            filterOption={filterOption}
            onChange={(itemId) => setSelectedItem(itemId)}
            value={selectedItem}
            style={styles.modalFormSelect}
            size="large"
            options={mappedOptions}
          />
        </div>
      </Space>
    </Modal>;
  });

class AssetModalProps<LinkType> {
  assetOptions: Asset[];
  onOk: (link: LinkType) => void;
  onCancel: () => void;
  open: boolean;
}

const AudioModal = React.memo(({assetOptions, onOk, onCancel, open}: AssetModalProps<{
  url: string;
  linkText: string | undefined;
}>) => {
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
  return <Modal title="Insert Audio" onOk={onOk_} onCancel={onCancel} open={open}>
    <Space direction="vertical" style={styles.modalFormSpace}>
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
          style={styles.modalFormSelect}
          size="large"
          options={options}
        />
      </div>
    </Space>
  </Modal>;
});

const ImageModal = React.memo(({assetOptions, onOk, onCancel, open}: AssetModalProps<string>) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onOk_ = useCallback(() => {
    if (!selectedAsset) return;
    onOk(assetIdToBytesUrl(selectedAsset));
    setSelectedAsset(null);
  }, [selectedAsset, onOk]);

  const options = useMemo(() => assetOptions.map(asset => ({
    label: <div>
      <Image src={assetIdToBytesUrl(asset.id)} height={40} />
      <span style={styles.imageOptionText}>{asset.file_name}</span>
    </div>,
    value: asset.id,
    search: asset.file_name,
  })), [assetOptions]);

  // noinspection JSValidateTypes
  return <Modal title="Insert Image" open={open} onOk={onOk_} onCancel={onCancel}>
    <Select
      placeholder="Image asset"
      showSearch={true}
      filterOption={filterOption}
      onChange={asset => setSelectedAsset(asset)}
      value={selectedAsset}
      style={styles.modalFormSelect}
      size="large"
      options={options}
    />
  </Modal>;
});

const VideoModal = React.memo(({assetOptions, onOk, onCancel, open}: AssetModalProps<{url: string}>) => {
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
  return <Modal title="Insert Video" open={open} onOk={onOk_} onCancel={onCancel}>
    <Select
      placeholder="Video asset"
      showSearch={true}
      filterOption={filterOption}
      onChange={asset => setSelectedAsset(asset)}
      value={selectedAsset}
      style={styles.modalFormSelect}
      size="large"
      options={options}
    />
  </Modal>;
});

type OtherLinkType = "station" | "modal" | "page";

interface HTMLEditorProps {
  initialValue?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  innerRef?: React.MutableRefObject<ReactQuill> | ((v: ReactQuill) => void),
  helpText?: string;
}

const HTMLEditor = ({initialValue, onChange, placeholder, innerRef, helpText}: HTMLEditorProps) => {
  const quillRef = useRef(null);

  const [assetOptions, setAssetOptions] = useState([]);
  const [currentRange, setCurrentRange] = useState(null);
  const [currentSelection, setCurrentSelection] = useState("");

  const [showViewer, setShowViewer] = useState<AssetType | OtherLinkType | null>(null);

  const assets = useAppSelector(state => state.assets.items);
  const {items: stations} = useStations();
  const modals = useAppSelector(state => state.modals.items);
  const pages = useAppSelector(state => state.pages.items);

  const assetHandler = (type: AssetType) => () => {
    setCurrentRange(quillRef.current.getEditor().getSelection(true));
    setAssetOptions(assets.filter(a => a.asset_type === type));
    setShowViewer(type);
  };
  
  const linkHandler = (type: OtherLinkType) => () => {
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

  const stationHandler = linkHandler("station");
  const modalHandler = linkHandler("modal");
  const pageHandler = linkHandler("page");

  const audioHandler = assetHandler("audio");
  const imageHandler = assetHandler("image");
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
  const modalInsertOk = useCallback((type: "link" | "tgcsAudio" | "image" | "html5Video") => (data) => {
    if (!quillRef.current) return;
    if (!data) return;
    if (type === "link") {
      quillRef.current.getEditor().formatText(currentRange.index, currentRange.length, type, data, "user");
    } else {
      quillRef.current.getEditor().insertEmbed(currentRange.index, type, data, "user");
    }
    modalInsertClose();
  }, [modalInsertClose, quillRef, currentRange]);

  const dividerInsert = useCallback(() => {
    const cr = quillRef.current.getEditor().getSelection(true);
    quillRef.current.getEditor().insertEmbed(cr.index, "divider", {}, "user");
  }, [quillRef]);

  // noinspection JSValidateTypes
  return <div>
    <LinkModal objectName="Station"
               objectPathItem="stations"
               options={stations}
               linkText={currentSelection}
               open={showViewer === "station"}
               onOk={modalInsertOk("link")}
               onCancel={modalInsertClose} />

    <LinkModal objectName="Modal"
               objectPathItem="modals"
               options={modals}
               linkText={currentSelection}
               open={showViewer === "modal"}
               onOk={modalInsertOk("link")}
               onCancel={modalInsertClose} />

    <LinkModal objectName="Page"
               objectPathItem="pages"
               options={pages}
               linkText={currentSelection}
               open={showViewer === "page"}
               onOk={modalInsertOk("link")}
               onCancel={modalInsertClose} />
    
    <AudioModal assetOptions={assetOptions}
                open={showViewer === "audio"}
                onOk={modalInsertOk("tgcsAudio")}
                onCancel={modalInsertClose} />

    <ImageModal assetOptions={assetOptions}
                open={showViewer === "image"}
                onOk={modalInsertOk("image")}
                onCancel={modalInsertClose} />

    <VideoModal assetOptions={assetOptions}
                open={showViewer === "video"}
                onOk={modalInsertOk("html5Video")}
                onCancel={modalInsertClose} />

    {helpText && <p style={helpTextStyle}>{helpText}</p>}

    <div style={styles.editorContainer}>
      <div style={styles.extraToolbar}>
        {/* I'm too lazy to work with Quill's annoying toolbar API */}
        <Space direction="horizontal">
          <Tooltip title="Divider">
            <Button onClick={dividerInsert} icon={<span>&mdash;</span>} />
          </Tooltip>
          <Divider type="vertical" style={styles.extraToolbarDivider} />
          <Button onClick={stationHandler} icon={<EnvironmentOutlined />}>Station</Button>
          <Button onClick={modalHandler} icon={<CloseSquareOutlined />}>Modal</Button>
          <Button onClick={pageHandler} icon={<FileOutlined />}>Page</Button>
          <Divider type="vertical" style={styles.extraToolbarDivider} />
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
      <ReactQuill
        theme="snow"
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
        placeholder={placeholder}
      />
    </div>
  </div>;
};

export default HTMLEditor;
