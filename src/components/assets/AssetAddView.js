import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

import {message, PageHeader} from "antd";

import AssetForm from "./AssetForm";

import {addAsset} from "../../modules/assets/actions";

const AssetAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onFinish = async v => {
        console.log("adding asset", v);

        const body = new FormData();
        body.set("asset_type", v.asset_type)
        body.set("file", v.file);

        const result = await dispatch(addAsset(body));

        if (!result.error) {
            message.success(`Added new asset: ${result.data.file_name}`);
            history.push(`/assets/edit/${result.data.id}`);
        }
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
