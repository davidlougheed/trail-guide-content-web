import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import LayerForm from "./LayerForm";
import {updateLayer} from "../../modules/layers/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const LayerEditView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {id: layerID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingLayers = useSelector(state => state.layers.isFetching);
  const updatingLayer = useSelector(state => state.layers.isUpdating);
  const layer = useSelector(state => findItemByID(state.layers.items, layerID));

  if (fetchingLayers) return <div>Loading...</div>;
  if (!layer) return <div>Layer not found</div>;  // TODO: Nice error

  const onFinish = async v => {
    console.log("saving layer", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateLayer(layer.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to layer: ${result.data.name}`);
    }
  };

  return <PageHeader
    onBack={() => history.goBack()}
    ghost={false}
    title={`Edit Layer: ${layer.name}`}
    subTitle="Press submit to save your changes."
  >
    <LayerForm initialValues={layer} onFinish={onFinish} loading={updatingLayer} />
  </PageHeader>;
};

export default LayerEditView;
