import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ReleaseForm from "./ReleaseForm";

import {addRelease} from "../../modules/releases/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const ReleaseAddView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {getAccessTokenSilently} = useAuth0();

  const addingRelease = useSelector(state => state.releases.isAdding);

  const onFinish = async v => {
    console.log("adding release", v);

    const body = {
      ...v,
    };

    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addRelease(body, accessToken));

    if (!result.error) {
      message.success(`Added new release: ${result.data.version}`);
      history.replace(`/releases/detail/${result.data.version}`);
    }
  };

  return <PageHeader
    onBack={() => history.goBack()}
    ghost={false}
    title="Add Release"
    subTitle="Create a new release (with release notes) to deploy to app stores."
  >
    <ReleaseForm onFinish={onFinish} loading={addingRelease} />
  </PageHeader>;
};

export default ReleaseAddView;
