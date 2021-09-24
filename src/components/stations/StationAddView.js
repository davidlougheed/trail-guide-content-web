import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

import {message, PageHeader} from "antd";

import StationForm from "./StationForm";

import {addStation} from "../../modules/stations/actions";

const StationAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onFinish = async v => {
        console.log("adding station", v);
        const result = await dispatch(addStation(v));
        if (result.error) {
            message.error(result.message);
        } else {
            message.success(`Added new station: ${result.data.title}`);
            history.push(`/stations/edit/${result.data.id}`);
        }
    };

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title="Add Station"
        subTitle="Create a new app station within a section"
    >
        <StationForm onFinish={onFinish} />
    </PageHeader>;
};

export default StationAddView;
