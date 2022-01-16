import React from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import LayerForm from "./LayerForm";

import {addLayer} from "../../modules/layers/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const LayerAddView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const addingLayer = useSelector(state => state.layers.isAdding);

  const onFinish = async v => {
    console.log("adding layer", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addLayer(v, accessToken));
    if (!result.error) {
      message.success(`Added new layer: ${result.data.name}`);
      navigate(`/layers/edit/${result.data.id}`, {replace: true});
    }
  };

  return <PageHeader
    onBack={() => navigate(-1)}
    ghost={false}
    title="Add Layer"
    subTitle="Create a new layer to show on the map"
  >
    <LayerForm onFinish={onFinish} loading={addingLayer} />
  </PageHeader>;
};

export default LayerAddView;
