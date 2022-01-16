import React from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import StationForm from "./StationForm";

import {addStation} from "../../modules/stations/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const StationAddView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const addingStation = useSelector(state => state.stations.isAdding);

  const onFinish = async v => {
    console.log("adding station", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addStation(v, accessToken));
    if (!result.error) {
      message.success(`Added new station: ${result.data.title}`);
      navigate(`/stations/edit/${result.data.id}`, {replace: true});
    }
  };

  return <PageHeader
    onBack={() => navigate(-1)}
    ghost={false}
    title="Add Station"
    subTitle="Create a new app station within a section"
  >
    <StationForm onFinish={onFinish} loading={addingStation} />
  </PageHeader>;
};

export default StationAddView;
