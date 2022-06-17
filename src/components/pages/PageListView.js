import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, QrcodeOutlined} from "@ant-design/icons";

import PageQR from "./PageQR";
import {useUrlPagination} from "../../hooks/pages";

const QRModal = React.memo(({page, modalCancel}) => {
  return <Modal title={page?.title}
                style={{top: 36}}
                visible={!!page}
                onCancel={modalCancel}
                footer={null}>
    {page ? <PageQR page={page} /> : null}
  </Modal>;
});

const PageListView = React.memo(() => {
  const navigate = useNavigate();

  const loadingPages = useSelector(state => state.pages.isFetching);
  const pages = useSelector(state => state.pages.items);

  const [qrPage, setQrPage] = useState(null);

  const columns = useMemo(() => [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      shouldCellUpdate: (r, pr) => (r?.enabled !== pr?.enabled),
      render: v => v ? (<CheckOutlined/>) : (<CloseOutlined/>),
    },
    {
      title: "Last Modified",
      render: station => (new Date(station.revision.timestamp)).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      shouldCellUpdate: (r, pr) => (r?.id !== pr?.id),
      render: page => (
        <Space size="small">
          <Tooltip title="Show QR Code">
            <Button icon={<QrcodeOutlined />}
                    onClick={() => setQrPage(page)} />
          </Tooltip>
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${page.id}`)}>View</Button>
          <Button icon={<EditOutlined/>}
                  onClick={() => navigate(`../edit/${page.id}`)}>Edit</Button>
        </Space>
      )
    },
  ], [navigate]);

  const modalCancel = useCallback(() => setQrPage(null), []);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Pages" subTitle="View and edit app pages">
    <QRModal page={qrPage} modalCancel={modalCancel} />
    <Table
      bordered={true}
      size="small"
      loading={loadingPages}
      columns={columns}
      dataSource={pages}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default PageListView;
