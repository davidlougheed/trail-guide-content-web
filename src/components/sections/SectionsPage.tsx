import React from "react";

import {PageHeader, Table} from "antd";
import {useUrlPagination} from "../../hooks/pages";
import {useAppSelector} from "../../hooks";

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
  const sectionsInitialFetch = useAppSelector(state => state.sections.initialFetchDone);
  const sectionsFetching = useAppSelector(state => state.sections.isFetching);
  const sections = useAppSelector(state => state.sections.items);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Sections" subTitle="View station sections">
    <Table
      bordered={true}
      size="small"
      loading={!sectionsInitialFetch && sectionsFetching}
      columns={COLUMNS}
      dataSource={sections}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default SectionsPage;
