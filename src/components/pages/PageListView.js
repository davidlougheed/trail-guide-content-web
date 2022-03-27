import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, QrcodeOutlined} from "@ant-design/icons";

import PageQR from "./PageQR";

const PageListView = () => {
  const navigate = useNavigate();

  const loadingPages = useSelector(state => state.pages.isFetching);
  const pages = useSelector(state => state.pages.items);

  const [qrPage, setQrPage] = useState(null);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      render: v => v ? (<CheckOutlined/>) : (<CloseOutlined/>),
    },
    {
      title: "Actions",
      key: "actions",
      render: page => (
        <Space size="small">
          <Button icon={<QrcodeOutlined />}
                  onClick={() => setQrPage(page)}>QR</Button>
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${page.id}`)}>View</Button>
          <Button icon={<EditOutlined/>}
                  onClick={() => navigate(`../edit/${page.id}`)}>Edit</Button>
        </Space>
      )
    },
  ];

  return <PageHeader
    ghost={false}
    title="Pages"
    subTitle="View and edit app pages"
  >
    <Modal title={qrPage?.title}
           style={{top: 36}}
           visible={!!qrPage}
           onCancel={() => setQrPage(null)}
           footer={null}>
      {qrPage ? <PageQR page={qrPage} /> : null}
    </Modal>
    <Table bordered={true} loading={loadingPages} columns={columns} dataSource={pages} rowKey="id" />
  </PageHeader>;
};

export default PageListView;
