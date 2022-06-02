import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const ModalListView = () => {
  const navigate = useNavigate();

  const loadingModals = useSelector(state => state.modals.isFetching);
  const modals = useSelector(state => state.modals.items);

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
      title: "Actions",
      key: "actions",
      render: modal => <Space size="middle">
        <Button icon={<EyeOutlined/>}
                onClick={() => navigate(`/modals/detail/${modal.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => navigate(`/modals/edit/${modal.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ], [navigate]);

  const onAdd = useCallback(() => navigate("/modals/add"), [navigate]);

  return <PageHeader
    ghost={false}
    title="Modals"
    subTitle="View and edit app modals"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={onAdd}>
        Add New</Button>,
    ]}
  >
    <Table bordered={true} loading={loadingModals} columns={columns} dataSource={modals} rowKey="id"/>
  </PageHeader>;
};

export default ModalListView;
