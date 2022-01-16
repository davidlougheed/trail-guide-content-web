import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, PageHeader, Space, Table} from "antd";
import {CheckSquareOutlined, CloseSquareOutlined, DeleteOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import {updateAsset} from "../../modules/assets/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const AssetListView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const [assetsLoading, setAssetsLoading] = useState({});

  const loadingAssets = useSelector(state => state.assets.isFetching);
  const assets = useSelector(state => state.assets.items);

  const setAssetEnable = async (assetID, enabledValue) => {
    setAssetsLoading({...assetsLoading, [assetID]: true});
    try {
      const body = new FormData();
      body.set("enabled", enabledValue ? "1" : "");
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(updateAsset(assetID, body, token));
    } finally {
      setAssetsLoading({...assetsLoading, [assetID]: undefined});
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "file_name",
      render: (fileName, asset) => <Link to={`../detail/${asset.id}`}>{fileName}</Link>,
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
    },
    {
      title: "Size",
      dataIndex: "file_size",
      render: fileSize => <span>{(fileSize / 1000).toFixed(0)} KB</span>,
    },
    {
      title: "Enabled?",
      dataIndex: "enabled",
      render: enabled => enabled ? "Yes" : "No",
    },
    {
      title: "Actions",
      key: "actions",
      render: asset => (
        <Space size="middle">
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${asset.id}`)}>View</Button>
          {asset.enabled ? (
            <Button loading={assetsLoading[asset.id]}
                    icon={<CloseSquareOutlined />}
                    onClick={() => setAssetEnable(asset.id, false)}>Disable</Button>
          ) : (
            <Button loading={assetsLoading[asset.id]}
                    icon={<CheckSquareOutlined />}
                    onClick={() => setAssetEnable(asset.id, true)}>Enable</Button>
          )}
          {/*<Button icon={<EditOutlined />}*/}
          {/*        onClick={() => navigate(`edit/${asset.id}`)}>Edit</Button>*/}
          <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
        </Space>
      )
    },
  ];

  const totalEnabledAssetSize = assets
    .filter(a => a.enabled)
    .reduce(((acc, asset) => acc + asset.file_size), 0);

  return <PageHeader
    ghost={false}
    title="Assets"
    subTitle="View and edit app assets (images, videos, and audio)"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => navigate("../add")}>
        Add New</Button>,
    ]}
  >
    <Table
      bordered={true}
      loading={loadingAssets}
      columns={columns}
      dataSource={assets}
      footer={() =>
        <span>
          <span style={{fontWeight: "bold"}}>Total Enabled Asset Size:</span>&nbsp;
          {loadingAssets ? `–` : `${(totalEnabledAssetSize / 1000).toFixed(0)} KB`}
        </span>}
      rowKey="id"
    />
  </PageHeader>;
};

export default AssetListView;
