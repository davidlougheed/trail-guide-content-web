import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import LayerForm from "./LayerForm";
import {updateLayer} from "../../modules/layers/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const LayerEditView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id: layerID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingLayers = useSelector(state => state.layers.isFetching);
  const updatingLayer = useSelector(state => state.layers.isUpdating);
  const layer = useSelector(state => findItemByID(state.layers.items, layerID));

  const onFinish = useCallback(async v => {
    console.log("saving layer", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateLayer(layer.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to layer: ${result.data.name}`);
    }
  }, [getAccessTokenSilently, dispatch, layer]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  if (fetchingLayers) return <div>Loading...</div>;

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title={layer ? `Edit Layer: ${layer.name}` : "Layer not found"}
    subTitle={layer ? "Press submit to save your changes." : ""}
  >
    {layer && <LayerForm initialValues={layer} onFinish={onFinish} loading={updatingLayer} />}
  </PageHeader>;
};

export default LayerEditView;
