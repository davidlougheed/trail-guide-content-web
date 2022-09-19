// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";

import {Button, Col, Form, Row, Select, Switch, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";
import {getFalse} from "../../utils";

const styles = {
  upload: {width: "100%"},
};

const ASSET_TYPES = [
  {value: "image", label: "Image"},
  {value: "audio", label: "Audio"},
  {value: "video", label: "Video"},
  {value: "video_text_track", label: "Video Text Track"},
  {value: "pdf", label: "PDF"},
];

const transformInitialValues = v => ({
  enabled: true,
  ...v,
  // TODO
});

const fileGetValueFromEvent = e => e.file;
const showUploadList = {showRemoveIcon: false};

const AssetForm = props => {
  const objectForm = useObjectForm({
    transformInitialValues,
    ...props,
  });

  return <ObjectForm objectForm={objectForm} {...props}>
    <Row gutter={12}>
      <Col flex="80px">
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item name="asset_type" label="Asset Type" rules={RULES_REQUIRED_BASIC}>
          <Select options={ASSET_TYPES} />
        </Form.Item>
      </Col>
      <Col flex={2}>
        <Form.Item name="file"
                   label="File"
                   valuePropName="file"
                   getValueFromEvent={fileGetValueFromEvent}
                   rules={RULES_REQUIRED_BASIC}>
          <Upload maxCount={1}
                  showUploadList={showUploadList}
                  beforeUpload={getFalse}
                  style={styles.upload}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Col>
    </Row>
  </ObjectForm>;
};

export default AssetForm;
