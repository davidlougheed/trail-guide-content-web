import React from "react";
import {useSelector} from "react-redux";

import {Button, Card, Col, Form, Input, Row, Select, Switch} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";

import HTMLEditor from "../HTMLEditor";

const contentTypes = [
    {value: "html", label: "Rich Text"},
    {value: "gallery", label: "Gallery"},
    {value: "quiz", label: "Quiz"},
];

const normalizeContents = c => ({...c, title: c.title || ""});

const StationForm = ({onFinish, initialValues, ...props}) => {
    const [form] = Form.useForm();

    const sections = useSelector(state => state.sections.items);
    const numStations = useSelector(state => state.stations.items.length);
    const categories = useSelector(state => state.categories.items);
    const assets = useSelector(state => state.assets.items);

    const oldInitialValues = initialValues ?? {};
    console.log("initial values", oldInitialValues);
    const newInitialValues = {
        rank: numStations,  // Add station to the end of the list in the app by default
        coordinates_utm: {
            zone: "18N",
            ...(oldInitialValues.coordinates_utm ?? {}),
        },
        ...oldInitialValues,
        contents: (oldInitialValues.contents ?? []).map(normalizeContents)
    };

    const onFinish_ = values => {
        (onFinish ?? (() => {}))({
            ...values,

            // Properly type everything
            header_image: values.header_image ?? null,
            coordinates_utm: {
                ...values.coordinates_utm,
                east: parseInt(values.coordinates_utm.east, 10),
                north: parseInt(values.coordinates_utm.north, 10),
            },
            contents: values.contents.map(normalizeContents) ?? [],
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
            <Col flex={1}>
                <Form.Item name="subtitle" label="Subtitle" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col flex="80px">
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
            <Col span={8}>
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
                    {errors}
                    {fields.map((field) => (
                        <Card
                            key={field.key}
                            size="small"
                            title="Content Item"
                            style={{
                                marginBottom: "12px",
                                position: "relative"
                            }}
                        >
                            <CloseCircleOutlined
                                onClick={() => remove(field.name)}
                                style={{position: "absolute", top: "12px", right: "12px", zIndex: 1}} />
                            <Form.Item noStyle={true}>
                                <Row gutter={12}>
                                    <Col span={8}>
                                        <Form.Item {...field}
                                                   key="content_type"
                                                   label="Content Type"
                                                   name={[field.name, "content_type"]}
                                                   fieldKey={[field.fieldKey, "content_type"]}
                                                   rules={[{required: true}]}>
                                            <Select placeholder="Content Type" options={contentTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item {...field}
                                                   key="title"
                                                   label="Title"
                                                   name={[field.name, "title"]}
                                                   fieldKey={[field.fieldKey, "title"]}
                                                   rules={[{required: true}]}>
                                            <Input placeholder="Title" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item {...field}
                                           key="content_before_fold"
                                           label="Content Before Fold"
                                           name={[field.name, "content_before_fold"]}
                                           fieldKey={[field.fieldKey, "content_before_fold"]}>
                                    <HTMLEditor />
                                </Form.Item>
                                <Form.Item {...field}
                                           key="content_after_fold"
                                           label="Content After Fold"
                                           name={[field.name, "content_after_fold"]}
                                           fieldKey={[field.fieldKey, "content_after_fold"]}>
                                    <HTMLEditor />
                                </Form.Item>
                            </Form.Item>
                        </Card>
                    ))}
                    <Form.Item>
                        <Button onClick={() => add()} icon={<PlusOutlined />}>Add Content Item</Button>
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
