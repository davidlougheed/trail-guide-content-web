// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";

import {Button, Col, Form, Row, Select, Switch, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const ASSET_TYPES = [
  {value: "image", label: "Image"},
  {value: "audio", label: "Audio"},
  {value: "video", label: "Video"},
  {value: "video_text_track", label: "Video Text Track"},
  {value: "pdf", label: "PDF"},
];

const AssetForm = ({initialValues, ...props}) => {
  const [form] = Form.useForm();

  const oldInitialValues = initialValues ?? {};
  console.log("initial values", oldInitialValues);
  const newInitialValues = {
    enabled: true,
    ...oldInitialValues,
    // TODO
  };

  return <Form {...props} form={form} layout="vertical" initialValues={newInitialValues}>
    <Row gutter={12}>
      <Col flex="80px">
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item name="asset_type" label="Asset Type" rules={[{required: true}]}>
          <Select options={ASSET_TYPES} />
        </Form.Item>
      </Col>
      <Col flex={2}>
        <Form.Item name="file"
                   label="File"
                   valuePropName="file"
                   getValueFromEvent={e => e.file}
                   rules={[{required: true}]}>
          <Upload maxCount={1}
                  showUploadList={{showRemoveIcon: false}}
                  beforeUpload={() => false}
                  style={{width: "100%"}}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Col>
    </Row>
    <Form.Item>
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form.Item>
  </Form>;
};

export default AssetForm;
