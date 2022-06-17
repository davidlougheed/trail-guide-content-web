import React from "react";
import {useSelector} from "react-redux";

import {PageHeader, Table} from "antd";
import {useUrlPagination} from "../../hooks/pages";

const COLUMNS = [
  {
    "title": "ID",
    "dataIndex": "id",
  },
  {
    "title": "Title",
    "dataIndex": "title",
  },
  // {
  //     "title": "Actions",
  //     "key": "actions",
  // },
];

const SectionsPage = React.memo(() => {
  const loadingSections = useSelector(state => state.sections.isFetching);
  const sections = useSelector(state => state.sections.items);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Sections" subTitle="View station sections">
    <Table
      bordered={true}
      size="small"
      loading={loadingSections}
      columns={COLUMNS}
      dataSource={sections}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default SectionsPage;
