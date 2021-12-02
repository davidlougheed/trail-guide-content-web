// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import SettingsForm from "./SettingsForm";
import {updateSettings} from "../../modules/settings/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const fetchingSettings = useSelector(state => state.settings.isFetching);
    const settings = useSelector(state => state.settings.data);
    const {getAccessTokenSilently} = useAuth0();

    if (fetchingSettings) return <div>Loading...</div>;

    const onFinish = async v => {
        console.log("saving settings", v);
        const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
        const result = await dispatch(updateSettings(v, accessToken));
        if (!result.error) {
            message.success("Saved changes to settings");
        }
    };

    return <PageHeader title="Settings" ghost={false}>
        <SettingsForm initialValues={settings} onFinish={onFinish} />
    </PageHeader>;
};

export default SettingsPage;
