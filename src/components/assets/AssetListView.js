import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import {deleteAsset} from "../../modules/assets/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";
import {useUrlPagination} from "../../hooks/pages";

const styles = {
  footerLabel: {fontWeight: "bold"},
};

const AssetListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const assetsInitialFetch = useSelector(state => state.assets.initialFetchDone);
  const assetsFetching = useSelector(state => state.assets.isFetching);
  const assets = useSelector(state => state.assets.items);
  const assetTypes = useSelector(state => state.assetTypes.items);

  const [delAsset, setDelAsset] = useState(null);

  const closeDelModal = useCallback(() => setDelAsset(null), []);

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
      title: "File name",
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
    // TODO: Link this to modal
    {
      title: "Times used (total / enabled)",
      width: 210,
      shouldCellUpdate: (r, pr) =>
        (r.times_used_by_all !== pr.times_used_by_all) ||
        (r.times_used_by_enabled !== pr.times_used_by_enabled),
      render: asset => `${asset.times_used_by_all} / ${asset.times_used_by_enabled}`,
    },
    {
      title: "Actions",
      key: "actions",
      shouldCellUpdate: (r, pr) => r.id !== pr.id || r.enabled !== pr.enabled,
      render: asset => console.log(asset) || (
        <Space size="small">
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`/assets/detail/${asset.id}`)}>View</Button>
          <Button
            icon={<DeleteOutlined/>}
            disabled={asset.times_used_by_all !== 0}
            danger={true}
            onClick={() => setDelAsset(asset)}>Delete</Button>
        </Space>
      )
    },
  ], [navigate]);

  const extra = useMemo(() => [
    <Button key="add" type="primary" icon={<PlusOutlined/>} onClick={() => navigate("/assets/add")}>Add New</Button>,
  ], [navigate]);

  // noinspection JSUnresolvedVariable
  const totalUsedAssetSize = useMemo(
    () => assets
      .filter(a => a.times_used_by_enabled > 0)
      .reduce(((acc, asset) => acc + asset.file_size), 0),
    [assets]);

  const footer = useCallback(
    () => <span>
        <span style={styles.footerLabel}>Total Used Asset Size:</span>&nbsp;
        {(!assetsInitialFetch && assetsFetching)
          ? `–`
          : `${(totalUsedAssetSize / 1000).toFixed(0)} KB`}
      </span>,
    [assetsInitialFetch, assetsFetching, totalUsedAssetSize],
  );

  const pagination = useUrlPagination();

  return <>
    <Modal title={`Delete asset: ${delAsset?.file_name}`}
           open={!!delAsset}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary" danger={true} icon={<DeleteOutlined />} onClick={onDelete}>Delete</Button>
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the asset &ldquo;{delAsset?.file_name}&rdquo;?
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
