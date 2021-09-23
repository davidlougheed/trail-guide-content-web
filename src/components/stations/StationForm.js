import React from "react";
import {useSelector} from "react-redux";

import {Button, Form, Input, Select, Switch} from "antd";

import HTMLEditor from "../HTMLEditor";

const StationsForm = () => {
    const [form] = Form.useForm();

    const sections = useSelector(state => state.sections.items);
    const categories = useSelector(state => state.categories.items);
    const assets = useSelector(state => state.assets.items);

    const onFinish = v => {
        console.log(v);
    };

    return <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{required: true}]}>
            <Input />
        </Form.Item>
        <Form.Item name="long_title" label="Long Title" rules={[{required: true}]}>
            <Input />
        </Form.Item>
        <Form.Item name="subtitle" label="Subtitle" rules={[{required: true}]}>
            <Input />
        </Form.Item>
        {/* TODO: Coordinates */}
        <Form.Item name="section" label="Section" rules={[{required: true}]}>
            <Select placeholder="Select app section for this station" options={sections.map(s => ({
                value: s.id,
                label: s.title,
            }))} />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{required: true}]}>
            <Select placeholder="Select category for this station" options={categories.map(c => ({value: c}))} />
        </Form.Item>
        <Form.Item name="header_image" label="Header Image">
            <Select placeholder="Select header image for this station"
                    allowClear={true}
                    options={assets.filter(a => a.asset_type === "image").map(a => ({
                        value: a.id,
                        label: a.file_name,
                    }))} />
        </Form.Item>
        <Form.List name="contents">
            {(fields, {add, remove}, {errors}) => (
                <>
                    {fields.map(field => (
                        <div key={field.key} style={{
                            border: "1px solid rgba(0, 0, 0, 0.3)",
                            padding: "12px",
                            marginBottom: "12px"
                        }}>
                            <Form.Item noStyle={true}>
                                <Form.Item {...field}
                                           key="content_type"
                                           label="Content Type"
                                           name={[field.name, "content_type"]}
                                           fieldKey={[field.fieldKey, "content_type"]}
                                           rules={[{required: true}]}>
                                    <Select placeholder="Content Type" options={[
                                        {value: "html", label: "Rich Text"},
                                        {value: "gallery", label: "Gallery"},
                                        {value: "quiz", label: "Quiz"},
                                    ]} />
                                </Form.Item>
                                <Form.Item {...field}
                                           key="content_before_fold"
                                           label="Content Before Fold"
                                           name={[field.name, "content_before_fold"]}
                                           fieldKey={[field.fieldKey, "content_before_fold"]}>
                                    <HTMLEditor />
                                </Form.Item>
                            </Form.Item>
                        </div>
                    ))}
                    <Form.Item>
                        <Button onClick={() => add()}>Add Content Item</Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    </Form>;
};

export default StationsForm;
