import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {CheckSquareOutlined, CloseSquareOutlined, DeleteOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import {deleteAsset, updateAsset} from "../../modules/assets/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";
import {useUrlPagination} from "../../hooks/pages";

const styles = {
  footerLabel: {fontWeight: "bold"},
};

const AssetListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const [assetsLoading, setAssetsLoading] = useState({});

  const assetsInitialFetch = useSelector(state => state.assets.initialFetchDone);
  const assetsFetching = useSelector(state => state.assets.isFetching);
  const assets = useSelector(state => state.assets.items);
  const assetTypes = useSelector(state => state.assetTypes.items);

  const [delAsset, setDelAsset] = useState(null);

  const setAssetEnable = useCallback(async (assetID, enabledValue) => {
    setAssetsLoading({...assetsLoading, [assetID]: true});
    try {
      const body = new FormData();
      body.set("enabled", enabledValue ? "1" : "");
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(updateAsset(assetID, body, token));
    } catch (e) {
      console.error(e);
    } finally {
      setAssetsLoading({...assetsLoading, [assetID]: undefined});
    }
  }, [assetsLoading, getAccessTokenSilently, dispatch]);

  const closeDelModal = useCallback(() => setDelAsset(null), []);

  const onDelAssetDisable = useCallback(async () => {
    if (!delAsset) return;
    await setAssetEnable(delAsset.id, false);
    closeDelModal();
  }, [setAssetEnable, delAsset]);

  const onDelete = useCallback(async () => {
    if (!delAsset) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(deleteAsset(delAsset.id, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delAsset]);

  // noinspection JSUnusedGlobalSymbols,JSUnresolvedVariable
  const columns = useMemo(() => [
    {
      title: "File Name",
      dataIndex: "file_name",
      shouldCellUpdate: (r, pr) => r.id !== pr.id || r.file_name !== pr.file_name,
      render: (fileName, asset) => <Link to={`/assets/detail/${asset.id}`}>{fileName}</Link>,
    },
    {
      title: "Type",
      dataIndex: "asset_type",
      filters: assetTypes.map(t => ({text: t, value: t})),
      onFilter: (value, record) => record.asset_type === value,
    },
    {
      title: "Size",
      dataIndex: "file_size",
      sorter: (a, b) => a.file_size - b.file_size,
      shouldCellUpdate: (r, pr) => r.file_size !== pr.file_size,
      render: fileSize => <span>{(fileSize / 1000).toFixed(0)}&nbsp;KB</span>,
    },
    {
      title: "Enabled?",
      dataIndex: "enabled",
      shouldCellUpdate: (r, pr) => r.enabled !== pr.enabled,
      render: enabled => enabled ? "Yes" : "No",
    },
    {
      title: "Actions",
      key: "actions",
      shouldCellUpdate: (r, pr) => r.id !== pr.id || r.enabled !== pr.enabled,
      render: asset => (
        <Space size="small">
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`/assets/detail/${asset.id}`)}>View</Button>
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
          <Button icon={<DeleteOutlined/>} danger={true} onClick={() => setDelAsset(asset)}>Delete</Button>
        </Space>
      )
    },
  ], [navigate, assetsLoading, setAssetEnable]);

  const extra = useMemo(() => [
    <Button key="add" type="primary" icon={<PlusOutlined/>} onClick={() => navigate("/assets/add")}>Add New</Button>,
  ], [navigate]);

  // noinspection JSUnresolvedVariable
  const totalEnabledAssetSize = useMemo(
    () => assets
      .filter(a => a.enabled)
      .reduce(((acc, asset) => acc + asset.file_size), 0),
    [assets]);

  const footer = useCallback(
    () => <span>
        <span style={styles.footerLabel}>Total Enabled Asset Size:</span>&nbsp;
        {(!assetsInitialFetch && assetsFetching)
          ? `–`
          : `${(totalEnabledAssetSize / 1000).toFixed(0)} KB`}
      </span>,
    [assetsInitialFetch, assetsFetching, totalEnabledAssetSize],
  );

  const pagination = useUrlPagination();

  return <>
    <Modal title={`Delete asset: ${delAsset?.file_name}`}
           open={!!delAsset}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary" danger={true} icon={<DeleteOutlined />} onClick={onDelete}>Delete</Button>
             {delAsset?.enabled
               ? <Button type="primary" icon={<CloseSquareOutlined />} onClick={onDelAssetDisable}>Disable</Button>
               : null}
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the asset &ldquo;{delAsset?.file_name}&rdquo;? If other content refers to
      this asset, those links will be <strong>broken</strong>.&nbsp;
      {delAsset?.enabled ? <span>
        If you wish, you can instead <a href="#" onClick={onDelAssetDisable}>disable</a> this asset.
      </span> : ""}
    </Modal>
    <PageHeader
      ghost={false}
      title="Assets"
      subTitle="View and edit app assets (images, videos, and audio)"
      extra={extra}
    >
      <Table
        bordered={true}
        size="small"
        loading={!assetsInitialFetch && assetsFetching}
        columns={columns}
        dataSource={assets}
        footer={footer}
        rowKey="id"
        pagination={pagination}
      />
    </PageHeader>
  </>;
});

export default AssetListView;
