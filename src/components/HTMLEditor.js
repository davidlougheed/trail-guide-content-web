import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";

import {Image, Modal, Select} from "antd";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {BASE_URL} from "../config";

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
];

const HTMLEditor = ({value, onChange, placeholder}) => {
    const quillRef = useRef(null);

    const [assetOptions, setAssetOptions] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const assets = useSelector(state => state.assets.items);

    const assetBytes = assetId => `${BASE_URL}/assets/${assetId}/bytes`;

    const imageHandler = async () => {
        setAssetOptions(assets.filter(a => a.asset_type === "image"));
        setShowImageViewer(true);
    };

    const modules = {
        toolbar: {
            container: [
                [{"header": [1, 2, 3, false]}],
                ["bold", "italic", "underline"],
                [{"list": "ordered"}, {"list": "bullet"}],
                ["link", "image", "video"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    // noinspection JSValidateTypes
    return <div>
        <Modal title="Insert Image"
               visible={showImageViewer}
               onOk={async () => {
                   if (!quillRef.current) return;
                   const editor = quillRef.current.getEditor();
                   const range = editor.getSelection(true);
                   console.log(range);
                   const e = editor.insertEmbed(range.index, "image", assetBytes(selectedAsset), "user");
                   console.log(e);
                   setShowImageViewer(false);
               }}
               onCancel={() => setShowImageViewer(false)}>
            <Select placeholder="Image asset"
                    onChange={asset => setSelectedAsset(asset)}
                    value={selectedAsset}
                    style={{width: "100%"}} size="large">
                {assetOptions.map(asset => (
                    <Select.Option value={asset.id} key={asset.id}>
                        <Image src={assetBytes(asset.id)} height={40} />
                        <span style={{marginLeft: 8, verticalAlign: "top"}}>{asset.file_name}</span>
                    </Select.Option>
                ))}
            </Select>
        </Modal>
        <ReactQuill theme="snow"
                    ref={quillRef}
                    formats={FORMATS}
                    modules={modules}
                    defaultValue=""
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder} />
    </div>;
};

export default HTMLEditor;
