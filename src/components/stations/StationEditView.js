import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {message, PageHeader} from "antd";

import StationForm from "./StationForm";
import {updateStation} from "../../modules/stations/actions";

const StationEditView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const fetchingStations = useSelector(state => state.stations.isFetching);
    const station = useSelector(state =>
        state.stations.items.find(s => s.id.toString() === match.params.id.toString()));

    if (fetchingStations) return <div>Loading...</div>;  // TODO: Nice loading
    if (!station) return <div>Station not found</div>;  // TODO: Nice error

    const onFinish = async v => {
        console.log("saving station", v);
        const result = await dispatch(updateStation(station.id, v));
        if (!result.error) {
            message.success(`Saved changes to station: ${result.data.title}`);
        }
    };

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title={`Edit Station: ${station.title}`}
        subTitle="Press submit to save your changes."
    >
        <StationForm initialValues={station} onFinish={onFinish} />
    </PageHeader>;
};

export default StationEditView;
