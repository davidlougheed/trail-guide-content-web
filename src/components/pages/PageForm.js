import React, {useCallback, useMemo, useRef} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Col, Divider, Form, Input, Row, Select, Switch} from "antd";

import HTMLEditor from "../editor/HTMLEditor";
import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";

const REVISION_MESSAGE_PATH = ["revision", "message"];

const PageForm = props => {
  const navigate = useNavigate();

  const quillRef = useRef(undefined);

  const numPages = useSelector(state => state.pages.items.length);
  const assets = useSelector(state => state.assets.items);

  const assetOptions = useMemo(() => assets.filter(a => a.asset_type === "image").map(a => ({
    value: a.id,
    label: a.file_name,
  })), [assets]);

  const transformInitialValues = useCallback(v => ({
    rank: numPages,  // Add page to the end of the list in the app by default
    ...v,
    revision: {
      working_copy: v.revision?.number ?? null,
      message: "",  // Clear revision message for possible filling out & re-submission
    },
  }), [numPages]);
  const transformFinalValues = useCallback(v => ({
    ...v,
    content: quillRef.current.getEditor().root.innerHTML,
  }), [quillRef]);

  const onView = useCallback(v => {
    if (!v.id) return;
    navigate(`/pages/detail/${v.id}`, {replace: true});
  }, [navigate]);

  const objectForm = useObjectForm({
    transformInitialValues,
    transformFinalValues,
    onView,
    ...props,
  });

  const {transformedInitialValues} = objectForm;

  return <ObjectForm objectForm={objectForm} {...props}>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="title" label="Title" rules={RULES_REQUIRED_BASIC}>
          <Input/>
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item name="long_title" label="Long Title" rules={RULES_REQUIRED_BASIC}>
          <Input/>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col span={16}>
        <Form.Item name="subtitle" label="Subtitle">
          <Input/>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch/>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="rank" label="Rank">
          <Input type="number" min={0} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="header_image" label="Header Image">
      <Select placeholder="Select header image for this station" allowClear={true} options={assetOptions} />
    </Form.Item>
    <Form.Item label="Content">
      <HTMLEditor initialValue={transformedInitialValues.content ?? ""} innerRef={quillRef}/>
    </Form.Item>
    <Divider />
    <Form.Item name={REVISION_MESSAGE_PATH} label="Revision Message">
      <Input />
    </Form.Item>
  </ObjectForm>;
};

export default PageForm;
