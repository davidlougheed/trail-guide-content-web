import React from "react";
import {useHistory} from "react-router-dom";

import {PageHeader} from "antd";

import StationForm from "./StationForm";

const StationAddView = () => {
    const history = useHistory();

    return <>
        <PageHeader
            onBack={() => history.goBack()}
            ghost={false}
            title="Add Station"
            subTitle="Create a new app station within a section"
        >
            <StationForm />
        </PageHeader>
    </>;
};

export default StationAddView;
