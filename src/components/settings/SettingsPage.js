// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Form, Input, message, Modal, PageHeader, Typography} from "antd";

import SettingsForm from "./SettingsForm";
import {updateSettings} from "../../modules/settings/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

import * as c from "../../config";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const fetchingSettings = useSelector(state => state.settings.isFetching);
  const updatingSettings = useSelector(state => state.settings.isUpdating);
  const settings = useSelector(state => state.settings.data);
  const serverConfig = useSelector(state => state.serverConfig.data);
  const {getAccessTokenSilently} = useAuth0();

  const [configShown, setConfigShown] = useState(false);

  const onFinish = useCallback(async v => {
    console.log("saving settings", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateSettings(v, accessToken));
    if (!result.error) {
      message.success("Saved changes to settings");
    }
  }, [getAccessTokenSilently, dispatch]);

  const showConfig = useCallback(() => setConfigShown(true), []);
  const hideConfig = useCallback(() => setConfigShown(false), []);

  if (fetchingSettings) return <div>Loading...</div>;

  return <>
    <Modal visible={configShown} onCancel={hideConfig} footer={null}>
      <Typography.Title level={3}>Front End</Typography.Title>
      <Form>
        {Object.entries(c).map(([ck, cv]) => <Form.Item label={ck} key={ck}>
          <Input value={cv} />
        </Form.Item>)}
      </Form>
      <Typography.Title level={3}>Back End</Typography.Title>
      <Form>
        {Object.entries(serverConfig ?? {}).map(([ck, cv]) => <Form.Item label={ck} key={ck}>
          <Input value={cv.toString()} />
        </Form.Item>)}
      </Form>
    </Modal>
    <PageHeader title="Settings" ghost={false} extra={[
      <Button key="config" onClick={showConfig}>View Instance Configuration</Button>
    ]}>
      <SettingsForm initialValues={settings} onFinish={onFinish} loading={updatingSettings} />
    </PageHeader>
  </>;
};

export default SettingsPage;
