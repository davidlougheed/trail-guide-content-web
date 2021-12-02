import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import ModalForm from "./ModalForm";

import {addModal} from "../../modules/modals/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const ModalAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {getAccessTokenSilently} = useAuth0();

    const onFinish = async v => {
        console.log("adding modal", v);
        const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
        const result = await dispatch(addModal(v, accessToken));
        if (!result.error) {
            message.success(`Added new modal: ${result.data.title}`);
            history.replace(`/modals/edit/${result.data.id}`);
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
