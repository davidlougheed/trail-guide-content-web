// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties} from "react";

import {Button, Col, Form, Row, Select, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import ObjectForm, {BaseParentObjectFormProps, RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";
import type {Asset} from "../../modules/assets/types";
import type {AssetType} from "../../modules/asset_types/types";
import {getFalse} from "../../utils";

const styles: {[key: string]: CSSProperties} = {
  upload: {width: "100%"},
};

const ASSET_TYPES: ({label: string; value: AssetType})[] = [
  {value: "image", label: "Image"},
  {value: "audio", label: "Audio"},
  {value: "video", label: "Video"},
  {value: "video_text_track", label: "Video Text Track"},
  {value: "pdf", label: "PDF"},
];

const fileGetValueFromEvent = e => e.file;
const showUploadList = {showRemoveIcon: false};

const AssetForm = (props: BaseParentObjectFormProps<Asset>) => {
  const objectForm = useObjectForm(props);

  return <ObjectForm objectForm={objectForm} {...props}>
    <Row gutter={12}>
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
