// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useRef} from "react";
import {useNavigate} from "react-router-dom";

import {Divider, Form, Input} from "antd"

import HTMLEditor from "../editor/HTMLEditor";
import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";

const REVISION_MESSAGE_PATH = ["revision", "message"];

const transformInitialValues = v => ({
  close_text: "Close",
  ...v,
  revision: {
    working_copy: v.revision?.number ?? null,
    message: "",  // Clear revision message for possible filling out & re-submission
  },
});

const ModalForm = ({...props}) => {
  const navigate = useNavigate();

  const quillRef = useRef(undefined);

  const transformFinalValues = useCallback(v => ({
    ...v,
    content: quillRef.current.getEditor().root.innerHTML,
  }), [quillRef]);

  const onView = useCallback(v => {
    if (!v.id) return;
    navigate(`/modals/detail/${v.id}`, {replace: true});
  }, [navigate]);

  const objectForm = useObjectForm({
    transformInitialValues,
    transformFinalValues,
    onView,
    ...props,
  });

  const {transformedInitialValues} = objectForm;

  return <ObjectForm objectForm={objectForm} {...props}>
    <Form.Item name="title" label="Title" rules={RULES_REQUIRED_BASIC}>
      <Input />
    </Form.Item>
    <Form.Item name="close_text" label="Close Button Text" rules={RULES_REQUIRED_BASIC}>
      <Input />
    </Form.Item>
    <Form.Item label="Content">
      <HTMLEditor initialValue={transformedInitialValues.content ?? ""} innerRef={quillRef} />
    </Form.Item>
    <Divider />
    <Form.Item name={REVISION_MESSAGE_PATH} label="Revision Message">
      <Input />
    </Form.Item>
  </ObjectForm>;
};

export default ModalForm;
