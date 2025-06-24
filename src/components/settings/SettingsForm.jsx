// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useRef} from "react";
import {Button, Form, Select} from "antd";
import {useAppSelector} from "../../hooks";
import HTMLEditor from "../editor/HTMLEditor";

const SettingsForm = React.memo(({ onFinish, loading, initialValues }) => {
  const [form] = Form.useForm();

  const ppQuillRef = useRef(undefined);

  const modals = useAppSelector((state) => state.modals.items);
  const modalOptions = useMemo(() => modals.map((m) => ({
    value: m.id,
    label: m.title,
  })), [modals]);

  const _onFinish = useCallback((values) => (onFinish ?? (() => {}))({
    terms_modal: values.terms_modal ?? null,
    privacy_policy: ppQuillRef.current.getEditor().root.innerHTML,
  }), []);

  return <Form form={form} layout="vertical" initialValues={initialValues} onFinish={_onFinish}>
    <Form.Item name="terms_modal"
               label="Terms Modal"
               help={"Shows on the first run of the app. Can be used to present terms and conditions, an " +
                 "introduction to the app, etc."}>
      <Select options={modalOptions} />
    </Form.Item>
    <Form.Item name="privacy_policy" label="Privacy Policy" help={"Shows on the Privacy Policy screen of the app."}>
      <HTMLEditor initialValue={initialValues?.privacy_policy ?? ""} innerRef={ppQuillRef} />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={loading}>Save</Button>
  </Form>;
});

export default SettingsForm;
