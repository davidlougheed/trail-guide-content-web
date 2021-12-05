import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";
import {updateModal} from "../../modules/modals/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const ModalEditView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {id: modalID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingModals = useSelector(state => state.modals.isFetching);
  const updatingModal = useSelector(state => state.modals.isUpdating);
  const modal = useSelector(state => findItemByID(state.modals.items, modalID));

  if (fetchingModals) return <div>Loading...</div>;
  if (!modal) return <div>Modal not found</div>;  // TODO: Nice error

  const onFinish = async v => {
    console.log("saving modal", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateModal(modal.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to modal: ${result.data.title}`);
    }
  };

  return <PageHeader
    onBack={() => history.goBack()}
    ghost={false}
    title={`Edit Modal: ${modal.title}`}
    subTitle="Press submit to save your changes."
  >
    <ModalForm initialValues={modal} onFinish={onFinish} loading={updatingModal} />
  </PageHeader>;
};

export default ModalEditView;
