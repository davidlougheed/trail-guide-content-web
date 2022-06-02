import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import AssetForm from "./AssetForm";

import {addAsset} from "../../modules/assets/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const AssetAddView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  /**
   * @param {{asset_type: string, enabled: boolean, file: string}} v
   * @return {Promise<void>}
   */
  const onFinish = useCallback(async v => {
    console.log("adding asset", v);

    const body = new FormData();
    body.set("asset_type", v.asset_type);
    body.set("enabled", v.enabled ? "1" : "");
    body.set("file", v.file);

    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);

    /**
     * @type {{data: {file_name: string}, error: string}}
     */
    const result = await dispatch(addAsset(body, accessToken));

    if (!result.error) {
      message.success(`Added new asset: ${result.data.file_name}`);
      navigate(`/assets/detail/${result.data.id}`, {replace: true});
    }
  }, [getAccessTokenSilently, dispatch, navigate]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title="Add Asset"
    subTitle="Create a new asset (image, video, or audio) for use in a station or page."
  >
    <AssetForm onFinish={onFinish}/>
  </PageHeader>;
};

export default AssetAddView;
