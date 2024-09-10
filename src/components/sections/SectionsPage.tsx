import React from "react";

import {PageHeader, Table, type TableColumnsType} from "antd";
import {useUrlPagination} from "../../hooks/pages";
import {useAppSelector} from "../../hooks";
import type {Section} from "../../modules/sections/types";
import SectionColorCircle from "./SectionColorCircle";

const COLUMNS: TableColumnsType<Section> = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Colour",
    dataIndex: "color",
    render: (color) => <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
      <SectionColorCircle hex={color} />
      <span style={{ fontFamily: "monospace" }}>#{color}</span>
    </div>,
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
