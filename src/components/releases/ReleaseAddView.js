import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ReleaseForm from "./ReleaseForm";

import {addRelease} from "../../modules/releases/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const ReleaseAddView = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const addingRelease = useSelector(state => state.releases.isAdding);

  const onFinish = useCallback(async v => {
    console.log("adding release", v);

    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addRelease(v, accessToken));

    if (!result.error) {
      message.success(`Added new release: ${result.data.version}`);
      navigate(`/releases/detail/${result.data.version}`, {replace: true});
    }
  }, [getAccessTokenSilently, dispatch, navigate]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title="Add Release"
    subTitle="Create a new release (with release notes) to deploy to app stores."
  >
    <ReleaseForm onFinish={onFinish} loading={addingRelease} />
  </PageHeader>;
});

export default ReleaseAddView;
