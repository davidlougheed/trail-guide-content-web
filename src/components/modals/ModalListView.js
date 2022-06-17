import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {useUrlPagination} from "../../hooks/pages";

const ModalListView = React.memo(() => {
  const navigate = useNavigate();

  const loadingModals = useSelector(state => state.modals.isFetching);
  const modals = useSelector(state => state.modals.items);

  // noinspection JSUnusedGlobalSymbols
  const columns = useMemo(() => [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Close Button Text",
      dataIndex: "close_text",
    },
    {
      title: "Last Modified",
      render: station => (new Date(station.revision.timestamp)).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      shouldCellUpdate: (r, pr) => (r?.id !== pr?.id),
      render: modal => <Space size="small">
        <Button icon={<EyeOutlined/>}
                onClick={() => navigate(`/modals/detail/${modal.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => navigate(`/modals/edit/${modal.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ], [navigate]);

  const onAdd = useCallback(() => navigate("/modals/add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add New</Button>,
  ], [onAdd]);

  const pagination = useUrlPagination();

  return <PageHeader
    ghost={false}
    title="Modals"
    subTitle="View and edit app modals"
    extra={extra}
  >
    <Table
      bordered={true}
      size="small"
      loading={loadingModals}
      columns={columns}
      dataSource={modals}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default ModalListView;
