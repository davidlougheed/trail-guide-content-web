// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import LayerForm from "./LayerForm";

import {addLayer} from "../../modules/layers/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const LayerAddView = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const addingLayer = useSelector(state => state.layers.isAdding);

  const onFinish = useCallback(async v => {
    console.log("adding layer", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addLayer(v, accessToken));
    if (!result.error) {
      message.success(`Added new layer: ${result.data.name}`);
      navigate(`/layers/detail/${result.data.id}`, {replace: true});
    }
  }, [getAccessTokenSilently, dispatch, navigate]);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onCancel = useCallback(() => navigate("/layers/list"), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title="Add Layer"
    subTitle="Create a new layer to show on the map"
  >
    <LayerForm onFinish={onFinish} onCancel={onCancel} loading={addingLayer} />
  </PageHeader>;
});

export default LayerAddView;
