import React, {useRef} from "react";
import {useSelector} from "react-redux";

import {Button, Col, Form, Input, Row, Select, Switch} from "antd";

import HTMLEditor from "../HTMLEditor";

const PageForm = ({initialValues, onFinish, ...props}) => {
    const [form] = Form.useForm();
    const quillRef = useRef(undefined);

    const numPages = useSelector(state => state.pages.items.length);
    const assets = useSelector(state => state.assets.items);

    const oldInitialValues = initialValues ?? {};
    console.log("initial values", oldInitialValues);
    const newInitialValues = {
        rank: numPages,  // Add page to the end of the list in the app by default
        ...oldInitialValues,
    };

    const _onFinish = data => {
        onFinish({...data, content: quillRef.current.getEditor().root.innerHTML});
    };

    return <Form {...props} onFinish={_onFinish} form={form} layout="vertical" initialValues={newInitialValues}>
        <Row gutter={12}>
            <Col span={8}>
                <Form.Item name="title" label="Title" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item name="long_title" label="Long Title" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={12}>
            <Col span={16}>
                <Form.Item name="subtitle" label="Subtitle">
                    <Input />
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="rank" label="Rank">
                    <Input type="number" min={0} />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item name="header_image" label="Header Image">
            <Select placeholder="Select header image for this station"
                    allowClear={true}
                    options={assets.filter(a => a.asset_type === "image").map(a => ({
                        value: a.id,
                        label: a.file_name,
                    }))} />
        </Form.Item>
        <Form.Item label="Content">
            <HTMLEditor initialValue={newInitialValues.content} innerRef={quillRef} />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    </Form>;
};

export default PageForm;
