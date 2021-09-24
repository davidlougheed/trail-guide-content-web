import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {PageHeader} from "antd";

import StationForm from "./StationForm";

const StationEditView = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const fetchingStations = useSelector(state => state.stations.isFetching);
    const station = useSelector(state =>
        state.stations.items.find(s => s.id.toString() === match.params.id.toString()));

    if (fetchingStations) return <div>Loading...</div>;  // TODO: Nice loading
    if (!station) return <div>Station not found</div>;  // TODO: Nice error

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title={`Edit Station: ${station.title}`}
        subTitle="Press submit to save your changes."
    >
        <StationForm initialValues={station} />
    </PageHeader>;
};

export default StationEditView;
