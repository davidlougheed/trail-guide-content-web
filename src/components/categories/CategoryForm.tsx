// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {memo} from "react";

import {Form, Input} from "antd";

import ObjectForm, {BaseParentObjectFormProps, RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";
import type {Category} from "../../modules/categories/types";

const CategoryForm = memo((props: BaseParentObjectFormProps<Category>) => {
  const objectForm = useObjectForm(props);

  return <ObjectForm objectForm={objectForm} {...props}>
    <Form.Item name="id" label="ID" rules={RULES_REQUIRED_BASIC}>
      <Input disabled={objectForm.editMode} />
    </Form.Item>
    <Form.Item name="icon_svg" label="Icon (SVG path)" rules={RULES_REQUIRED_BASIC}>
      <Input.TextArea />
    </Form.Item>
  </ObjectForm>;
});

export default CategoryForm;
