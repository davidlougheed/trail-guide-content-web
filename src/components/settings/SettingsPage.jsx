// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Form, Input, message, Modal, PageHeader, Skeleton, Typography} from "antd";

import SettingsForm from "./SettingsForm";
import {useCachedServerConfig} from "../../modules/server/hooks";
import {updateSettings} from "../../modules/settings/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

import * as c from "../../config";
import {useAppDispatch, useAppSelector} from "../../hooks";

const SettingsPage = React.memo(() => {
  const dispatch = useAppDispatch();

  const settingsInitialFetch = useAppSelector(state => state.settings.initialFetchDone);
  const fetchingSettings = useAppSelector(state => state.settings.isFetching);
  const updatingSettings = useAppSelector(state => state.settings.isUpdating);

  const settings = useAppSelector(state => state.settings.data);
  const {config: serverConfig} = useCachedServerConfig();
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

  // noinspection JSValidateTypes
  return <>
    <Modal open={configShown} onCancel={hideConfig} footer={null}>
      <Typography.Title level={3}>Front End</Typography.Title>
      <Form>
        {Object.entries(c).map(([ck, cv]) => <Form.Item label={ck} key={ck}>
          <Input value={cv} />
        </Form.Item>)}
      </Form>
      <Typography.Title level={3}>Back End</Typography.Title>
      <Form>
        {Object.entries(serverConfig).map(([ck, cv]) => (
          <Form.Item label={ck} key={ck}>
            <Input value={cv.toString()} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
    <PageHeader title="Settings" ghost={false} extra={[
      <Button key="config" loading={!settingsInitialFetch && fetchingSettings} onClick={showConfig}>
        View Instance Configuration</Button>
    ]}>
      {settings
        ? <SettingsForm initialValues={settings} onFinish={onFinish} loading={updatingSettings} />
        : <Skeleton title={false} />}
    </PageHeader>
  </>;
});

export default SettingsPage;
