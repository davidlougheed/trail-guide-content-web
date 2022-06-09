import React, {useCallback, useMemo} from "react";

import {Button, Col, Form, Input, InputNumber, Row, Switch} from "antd"

const LayerForm = React.memo(({initialValues, onFinish, loading, ...props}) => {
  const [form] = Form.useForm();

  const oldInitialValues = useMemo(() => initialValues ?? {}, [initialValues]);
  console.log("initial values", oldInitialValues);
  const newInitialValues = useMemo(() => ({
    enabled: true,
    rank: 0,
    ...oldInitialValues,
    geojson: oldInitialValues.geojson ? JSON.stringify(oldInitialValues.geojson, null, 2) : "",
  }), [oldInitialValues]);

  const _onFinish = useCallback(v => onFinish({
    ...v,
    geojson: JSON.parse(v.geojson),
  }), [onFinish]);

  return <Form {...props} onFinish={_onFinish} form={form} layout="vertical" initialValues={newInitialValues}>
    <Row gutter={12}>
      <Col span={16}>
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
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
    <Form.Item name="geojson" label="GeoJSON" rules={[{required: true}]}>
      <Input.TextArea rows={10} style={{fontFamily: "monospace"}} spellCheck={false} />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
    </Form.Item>
  </Form>;
});

export default LayerForm;
