// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";

import {Col, Form, Input, InputNumber, Row, Switch} from "antd";

import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";

const styles = {
  textarea: {fontFamily: "monospace"},
};

const transformInitialValues = v => ({
  enabled: true,
  rank: 0,
  ...v,
  geojson: v.geojson ? JSON.stringify(v.geojson, null, 2) : "",
});
const transformFinalValues = v => ({
  ...v,
  geojson: v.geojson ? JSON.parse(v.geojson) : null,
});

const LayerForm = React.memo(({...props}) => {
  const navigate = useNavigate();

  const onView = useCallback(v => {
    if (!v.id) return;
    navigate(`/layers/detail/${v.id}`, {replace: true});
  }, [navigate]);

  const objectForm = useObjectForm({
    transformInitialValues,
    transformFinalValues,
    onView,
    ...props,
  });

  return <ObjectForm objectForm={objectForm} {...props}>
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
