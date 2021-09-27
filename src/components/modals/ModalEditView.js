import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";
import {updateModal} from "../../modules/modals/actions";

const ModalEditView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const fetchingModals = useSelector(state => state.modals.isFetching);
    const modal = useSelector(state =>
        state.modals.items.find(m => m.id.toString() === match.params.id.toString()));

    if (fetchingModals) return <div>Loading...</div>;
    if (!modal) return <div>Modal not found</div>;  // TODO: Nice error

    const onFinish = async v => {
        console.log("saving modal", v);
        const result = await dispatch(updateModal(modal.id, v));
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
        <ModalForm initialValues={modal} onFinish={onFinish} />
    </PageHeader>;
};

export default ModalEditView;
