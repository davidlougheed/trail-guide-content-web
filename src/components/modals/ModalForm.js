import React, {useCallback, useMemo, useRef} from "react";

import {Button, Divider, Form, Input} from "antd"

import HTMLEditor from "../editor/HTMLEditor";

const RULES_REQUIRED = [{required: true}];

const ModalForm = ({initialValues, onFinish, loading, ...props}) => {
  const [form] = Form.useForm();
  const quillRef = useRef(undefined);

  const oldInitialValues = useMemo(() => initialValues ?? {}, [initialValues]);
  console.log("initial values", oldInitialValues);
  const newInitialValues = useMemo(() => ({
    close_text: "Close",
    ...oldInitialValues,
    revision: {
      working_copy: oldInitialValues.revision?.number ?? null,
      message: "",  // Clear revision message for possible filling out & re-submission
    },
  }), [oldInitialValues]);

  const _onFinish = useCallback(data => {
    onFinish({...data, content: quillRef.current.getEditor().root.innerHTML});
  }, [onFinish, quillRef]);

  return <Form {...props} onFinish={_onFinish} form={form} layout="vertical" initialValues={newInitialValues}>
    <Form.Item name="title" label="Title" rules={RULES_REQUIRED}>
      <Input />
    </Form.Item>
    <Form.Item name="close_text" label="Close Button Text" rules={RULES_REQUIRED}>
      <Input />
    </Form.Item>
    <Form.Item label="Content">
      <HTMLEditor initialValue={newInitialValues.content} innerRef={quillRef}/>
    </Form.Item>
    <Divider />
    <Form.Item name={["revision", "message"]} label="Revision Message">
      <Input />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
    </Form.Item>
  </Form>;
};

export default ModalForm;
