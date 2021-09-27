import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";

import {addModal} from "../../modules/modals/actions";

const ModalAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onFinish = async v => {
        console.log("adding modal", v);
        const result = await dispatch(addModal(v));
        if (!result.error) {
            message.success(`Added new modal: ${result.data.title}`);
            history.push(`/modals/edit/${result.data.id}`);
        }
    };

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title="Add Modal"
        subTitle="Create a new modal, for use in pages and stations"
    >
        <ModalForm onFinish={onFinish} />
    </PageHeader>;
};

export default ModalAddView;
