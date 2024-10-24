// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {memo} from "react";

import {Form, Input, InputNumber} from "antd";

import ObjectForm, {BaseParentObjectFormProps, RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";
import {useSections} from "../../modules/sections/hooks";
import {Section} from "../../modules/sections/types";
import SectionColorCircle from "./SectionColorCircle";

const HEX_PATTERN = /^[A-Fa-f0-9]{6}$/;

const SectionForm = memo((props: BaseParentObjectFormProps<Section>) => {
  const objectForm = useObjectForm(props);

  const currentColor = Form.useWatch(["color"], objectForm.form);

  const {items: sections} = useSections();

  return <ObjectForm objectForm={objectForm} {...props}>
    <Form.Item name="id" label="ID" rules={RULES_REQUIRED_BASIC}>
      <Input disabled={objectForm.editMode} />
    </Form.Item>
    <Form.Item name="title" label="Title" rules={RULES_REQUIRED_BASIC}>
      <Input />
    </Form.Item>
    {/* TODO: ColorPicker when AntD v5 migration is done */}
    <Form.Item name="color" label="Colour" rules={[...RULES_REQUIRED_BASIC, {pattern: HEX_PATTERN}]}>
      <Input addonBefore={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SectionColorCircle hex={HEX_PATTERN.test(currentColor) ? currentColor : "FAFAFA"} />
          <span>#</span>
        </div>
      } />
    </Form.Item>
    <Form.Item
      name="rank"
      label="Rank"
      rules={RULES_REQUIRED_BASIC}
      initialValue={objectForm.editMode ? undefined : sections.length}
    >
      <InputNumber min={0} />
    </Form.Item>
  </ObjectForm>;
});

export default SectionForm;
