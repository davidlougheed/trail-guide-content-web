import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";
import {updateModal} from "../../modules/modals/actions";
import {findItemByID} from "../../utils";

const ModalEditView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {id: modalID} = useParams();

    const fetchingModals = useSelector(state => state.modals.isFetching);
    const modal = useSelector(state => findItemByID(state.modals.items, modalID));

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
