import React from "react";

import {Button, Form, Input} from "antd"

import HTMLEditor from "../HTMLEditor";

const ModalForm = ({initialValues, ...props}) => {
    const [form] = Form.useForm();

    const oldInitialValues = initialValues ?? {};
    console.log("initial values", oldInitialValues);
    const newInitialValues = {
        close_text: "Close",
        ...oldInitialValues,
    };

    return <Form {...props} form={form} layout="vertical" initialValues={newInitialValues}>
        <Form.Item name="title" label="Title" rules={[{required: true}]}>
            <Input />
        </Form.Item>
        <Form.Item name="close_text" label="Close Button Text" rules={[{required: true}]}>
            <Input />
        </Form.Item>
        <Form.Item name="content" label="Content">
            <HTMLEditor />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    </Form>;
};

export default ModalForm;
