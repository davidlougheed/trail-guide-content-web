import React, {useMemo} from "react";
import {useSelector} from "react-redux";

import {Button, Col, Form, Input, Row, Switch} from "antd";

const RULES_REQUIRED = [{required: true}];

const ReleaseForm = React.memo(({initialValues, onFinish, loading, ...props}) => {
  const [form] = Form.useForm();

  const releases = useSelector(state => state.releases.items);

  const oldInitialValues = useMemo(() => initialValues ?? {}, [initialValues]);
  console.log("initial values", oldInitialValues);
  const newInitialValues = useMemo(() => ({
    ...oldInitialValues,
    published: !!oldInitialValues.published_dt,
  }), [oldInitialValues]);

  return <Form {...props} onFinish={onFinish} form={form} layout="vertical" initialValues={newInitialValues}>
    <Row gutter={12}>
      <Col flex={1}>
        <Form.Item label="Version">
          <Input disabled={true} value={newInitialValues.version ?? ((releases[0]?.version ?? 0) + 1)} />
        </Form.Item>
      </Col>
      <Col style={{width: 200}}>
        <Form.Item label="Published">
          <Switch checked={newInitialValues.published} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="release_notes" label="Release Notes" rules={RULES_REQUIRED}>
      <Input.TextArea rows={5} disabled={newInitialValues.published} />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
    </Form.Item>
  </Form>;
});

export default ReleaseForm;
