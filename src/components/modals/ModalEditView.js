import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {PageHeader} from "antd";

import ModalForm from "./ModalForm";

const ModalEditView = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const modal = useSelector(state =>
        state.modals.items.find(m => m.id.toString() === match.params.id.toString()));

    if (!modal) return <div>Modal not found</div>;  // TODO: Nice error

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title={`Edit Modal: ${modal.title}`}
        subTitle="Press submit to save your changes."
    >
        <ModalForm initialValues={modal} />
    </PageHeader>;
};

export default ModalEditView;
