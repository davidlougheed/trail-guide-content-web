import React from "react";
import {useSelector} from "react-redux";

import {Col, Form, Input, Row, Switch} from "antd";

import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";

const styles = {
  columnPublished: {width: 200},
};

const transformInitialValues = v => ({
  ...v,
  published: !!v.published_dt,
});

const ReleaseForm = React.memo(({initialValues, ...props}) => {
  const releases = useSelector(state => state.releases.items);
  const objectForm = useObjectForm({
    initialValues,
    transformInitialValues,
    ...props,
  });

  const {transformedInitialValues} = objectForm;

  return <ObjectForm objectForm={objectForm}>
    <Row gutter={12}>
      <Col flex={1}>
        <Form.Item label="Version">
          <Input disabled={true} value={transformedInitialValues.version ?? ((releases[0]?.version ?? 0) + 1)} />
        </Form.Item>
      </Col>
      <Col style={styles.columnPublished}>
        <Form.Item label="Published">
          <Switch checked={transformedInitialValues.published} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="release_notes" label="Release Notes" rules={RULES_REQUIRED_BASIC}>
      <Input.TextArea rows={5} disabled={transformedInitialValues.published} />
    </Form.Item>
  </ObjectForm>;
});

export default ReleaseForm;
