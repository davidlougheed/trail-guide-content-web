import React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FORMATS = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
];

const HTMLEditor = ({value, onChange, placeholder}) => {
    return <ReactQuill theme="snow"
                       formats={FORMATS}
                       value={value ?? ""}
                       onChange={onChange}
                       placeholder={placeholder} />;
};

export default HTMLEditor;
