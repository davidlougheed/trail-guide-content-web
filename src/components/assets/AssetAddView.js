import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

import {PageHeader} from "antd";

import AssetForm from "./AssetForm";

import {addAsset} from "../../modules/assets/actions";

const AssetAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onFinish = v => {
        console.log("adding asset", v);
        // TODO
    };

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title="Add Asset"
        subTitle="Create a new asset (image, video, or audio) for use in a station or page."
    >
        <AssetForm onFinish={onFinish} />
    </PageHeader>;
};

export default AssetAddView;
