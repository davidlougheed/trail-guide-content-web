import React from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import AssetForm from "./AssetForm";

import {AUTH_AUDIENCE} from "../../config";
import {addAsset} from "../../modules/assets/actions";

const AssetAddView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {getAccessTokenSilently} = useAuth0();

    const onFinish = async v => {
        console.log("adding asset", v);

        const body = new FormData();
        body.set("asset_type", v.asset_type)
        body.set("file", v.file);

        const accessToken = await getAccessTokenSilently({
            audience: AUTH_AUDIENCE,
            scope: "manage:content",
        });
        const result = await dispatch(addAsset(body, accessToken));

        if (!result.error) {
            message.success(`Added new asset: ${result.data.file_name}`);
            history.replace(`/assets/edit/${result.data.id}`);
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
