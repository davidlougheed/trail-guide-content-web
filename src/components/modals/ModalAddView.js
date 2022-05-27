import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";

import {addModal} from "../../modules/modals/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const ModalAddView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const addingModal = useSelector(state => state.modals.isAdding);

  const onFinish = useCallback(async v => {
    console.log("adding modal", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addModal(v, accessToken));
    if (!result.error) {
      message.success(`Added new modal: ${result.data.title}`);
      navigate(`/modals/edit/${result.data.id}`, {replace: true});
    }
  }, [getAccessTokenSilently, navigate]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title="Add Modal"
    subTitle="Create a new modal, for use in pages and stations"
  >
    <ModalForm onFinish={onFinish} loading={addingModal} />
  </PageHeader>;
};

export default ModalAddView;
