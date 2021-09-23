import React from "react";
import {useSelector} from "react-redux";

import {Button, Form, Input, Select, Switch} from "antd";

const StationsForm = () => {
    const [form] = Form.useForm();

    const sections = useSelector(state => state.sections.items);
    const categories = useSelector(state => state.categories.items);

    return <Form form={form}>
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
        <Form.Item name="enabled" label="Enabled" rules={[{required: true}]}>
            <Switch />
        </Form.Item>
        <Form.Item>
            <Button type="primary">Submit</Button>
        </Form.Item>
    </Form>;
};

export default StationsForm;
