import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {message, PageHeader} from "antd";

import SettingsForm from "./SettingsForm";
import {updateSettings} from "../../modules/settings/actions";

const SettingsPage = () => {
    const dispatch = useDispatch();

    const fetchingSettings = useSelector(state => state.settings.isFetching);
    const settings = useSelector(state => state.settings.data);

    if (fetchingSettings) return <div>Loading...</div>;

    const onFinish = async v => {
        console.log("saving settings", v);
        const result = await dispatch(updateSettings(v));
        if (!result.error) {
            message.success("Saved changes to settings");
        }
    };

    return <PageHeader title="Settings" ghost={false}>
        <SettingsForm initialValues={settings} onFinish={onFinish} />
    </PageHeader>;
};

export default SettingsPage;
