import React from "react";
import {useSelector} from "react-redux";
import {Button, Form, Select} from "antd";

const SettingsForm = ({onFinish, ...props}) => {
    const modals = useSelector(state => state.modals.items);
    const [form] = Form.useForm();

    const _onFinish = values => (onFinish ?? (() => {}))({
        terms_modal: values.terms_modal ?? null,
    });

    return <Form {...props} form={form} layout="vertical" onFinish={_onFinish}>
        <Form.Item name="terms_modal"
                   label="Terms Modal"
                   help={"Shows on the first run of the app. Can be used to present terms and conditions, an " +
                   "introduction to the app, etc."}>
            <Select options={modals.map(m => ({
                value: m.id,
                label: m.title,
            }))} />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>
    </Form>;
};

export default SettingsForm;
