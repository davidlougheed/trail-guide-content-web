import React from "react";
import {PageHeader} from "antd";
import SettingsForm from "./SettingsForm";
import {useSelector} from "react-redux";

const SettingsPage = () => {
    const fetchingSettings = useSelector(state => state.settings.isFetching);
    const settings = useSelector(state => state.settings.data);

    if (fetchingSettings) return <div>Loading...</div>;

    return <PageHeader title="Settings" ghost={false}>
        <SettingsForm initialValues={settings} />
    </PageHeader>;
};

export default SettingsPage;
