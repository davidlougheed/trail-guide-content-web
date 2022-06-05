import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import StationForm from "./StationForm";
import {updateStation} from "../../modules/stations/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const StationEditView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id: stationID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingStations = useSelector(state => state.stations.isFetching);
  const updatingStations = useSelector(state => state.stations.isUpdating);
  const station = useSelector(state => findItemByID(state.stations.items, stationID));

  const onFinish = useCallback(async v => {
    console.log("saving station", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateStation(station.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to station: ${result.data.title}`);
    }
  }, [getAccessTokenSilently, dispatch, station]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title={fetchingStations ? "Loading..." : (station ? `Edit Station: ${station.title}` : "Station not found")}
    subTitle={station ? "Press submit to save your changes." : ""}
  >
    {station && <StationForm initialValues={station} onFinish={onFinish} loading={updatingStations} />}
  </PageHeader>;
};

export default StationEditView;
