// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {findItemByID} from "../../utils";

const PageDetailView = () => {
    const history = useHistory();
    const {id: pageID} = useParams();

    const fetchingPages = useSelector(state => state.pages.isFetching);
    const page = useSelector(state => findItemByID(state.pages.items, pageID));

    if (!page) return "Loading...";

    return <PageHeader
        ghost={false}
        onBack={() => history.goBack()}
        title={fetchingPages ? "Loading..." : <span>Page: {page.title}</span>}
        extra={[
            <Button key="edit" icon={<EditOutlined />} onClick={() => history.push(`/pages/edit/${pageID}`)}>
                Edit
            </Button>,
        ]}
    >
        <Typography.Title level={2}>{page.long_title}</Typography.Title>
        <Descriptions bordered={true}>
            <Descriptions.Item label="Subtitle">{page.subtitle}</Descriptions.Item>
            <Descriptions.Item label="Menu Icon">{page.icon}</Descriptions.Item>
            <Descriptions.Item label="Enabled">{page?.enabled ? "Yes" : "No"}</Descriptions.Item>
        </Descriptions>

        <Card size="small" title="Content" style={{marginTop: 16}}>
            <div className="page-detail-content" dangerouslySetInnerHTML={{__html: page.content}} />
        </Card>
    </PageHeader>;
};

export default PageDetailView;
