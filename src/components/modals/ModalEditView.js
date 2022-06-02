import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";
import {updateModal} from "../../modules/modals/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const ModalEditView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id: modalID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingModals = useSelector(state => state.modals.isFetching);
  const updatingModal = useSelector(state => state.modals.isUpdating);
  const modal = useSelector(state => findItemByID(state.modals.items, modalID));

  const onFinish = useCallback(async v => {
    console.log("saving modal", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateModal(modal.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to modal: ${result.data.title}`);
    }
  }, [getAccessTokenSilently, dispatch, modal]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  if (fetchingModals) return <div>Loading...</div>;

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title={modal ? `Edit Modal: ${modal.title}` : "Modal not found"}
    subTitle={modal ? "Press submit to save your changes." : ""}
  >
    {modal && <ModalForm initialValues={modal} onFinish={onFinish} loading={updatingModal} />}
  </PageHeader>;
};

export default ModalEditView;
