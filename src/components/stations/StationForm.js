import React from "react";
import {useSelector} from "react-redux";

import {Button, Col, Form, Input, Row, Select, Switch} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";

import HTMLEditor from "../HTMLEditor";

const StationForm = ({onFinish, initialValues, ...props}) => {
    const [form] = Form.useForm();

    const sections = useSelector(state => state.sections.items);
    const stations = useSelector(state => state.stations.items);
    const categories = useSelector(state => state.categories.items);
    const assets = useSelector(state => state.assets.items);

    const oldInitialValues = initialValues ?? {};
    const newInitialValues = {
        rank: stations.length,  // Add station to the end of the list in the app by default
        ...oldInitialValues,
    };

    const onFinish_ = values => {
        onFinish({
            ...values,

            // Properly type everything
            header_image: values.header_image ?? null,
            coordinates_utm: {
                ...values.coordinates_utm,
                east: parseInt(values.coordinates_utm.east, 10),
                north: parseInt(values.coordinates_utm.north, 10),
            },
            contents: values.contents ?? [],
            enabled: !!values.enabled,
            rank: parseInt(values.rank),
        });
    };

    return <Form form={form} layout="vertical" initialValues={newInitialValues} onFinish={onFinish_} {...props}>
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
                <Form.Item name="subtitle" label="Subtitle" rules={[{required: true}]}>
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
        <Row gutter={12}>
            <Col span={8} >
                <Form.Item name={["coordinates_utm", "zone"]} label="UTM Zone" rules={[{required: true}]}>
                    <Select>
                        <Select.Option value="18N">18N</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name={["coordinates_utm", "east"]} label="Easting" rules={[{required: true}]}>
                    <Input type="number" addonAfter="E" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name={["coordinates_utm", "north"]} label="Northing" rules={[{required: true}]}>
                    <Input type="number" addonAfter="N" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={12}>
            <Col span={8}>
                <Form.Item name="header_image" label="Header Image">
                    <Select placeholder="Select header image for this station"
                            allowClear={true}
                            options={assets.filter(a => a.asset_type === "image").map(a => ({
                                value: a.id,
                                label: a.file_name,
                            }))} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="section" label="Section" rules={[{required: true}]}>
                    <Select placeholder="Select app section for this station" options={sections.map(s => ({
                        value: s.id,
                        label: s.title,
                    }))} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="category" label="Category" rules={[{required: true}]}>
                    <Select placeholder="Select category for this station"
                            options={categories.map(c => ({value: c}))} />
                </Form.Item>
            </Col>
        </Row>
        <Form.List name="contents">
            {(fields, {add, remove}, {errors}) => (
                <>
                    {fields.map((field) => (
                        <div key={field.key} style={{
                            border: "1px solid rgba(0, 0, 0, 0.3)",
                            padding: "12px",
                            marginBottom: "12px",
                            position: "relative"
                        }}>
                            <CloseCircleOutlined
                                onClick={() => remove(field.name)}
                                style={{position: "absolute", top: "12px", right: "12px", zIndex: 1}} />
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
        <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    </Form>;
};

export default StationForm;
