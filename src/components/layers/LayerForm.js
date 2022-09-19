// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";

import {Col, Form, Input, InputNumber, Row, Switch} from "antd";

import ObjectForm, {RULES_REQUIRED_BASIC} from "../ObjectForm";

const styles = {
  textarea: {fontFamily: "monospace"},
};

const transformInitialValues = v => ({
  enabled: true,
  rank: 0,
  ...v,
  geojson: v.geojson ? JSON.stringify(v.geojson, null, 2) : "",
});
const transformFinalValues = v => ({...v, geojson: v.geojson ? JSON.parse(v.geojson) : null});

const LayerForm = React.memo(({...props}) => {
  return <ObjectForm {...props}
                     transformInitialValues={transformInitialValues}
                     transformFinalValues={transformFinalValues}>
    <Row gutter={12}>
      <Col span={16}>
        <Form.Item name="name" label="Name" rules={RULES_REQUIRED_BASIC}>
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
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="geojson" label="GeoJSON" rules={RULES_REQUIRED_BASIC}>
      <Input.TextArea rows={10} style={styles.textarea} spellCheck={false} />
    </Form.Item>
  </ObjectForm>;
});

export default LayerForm;
