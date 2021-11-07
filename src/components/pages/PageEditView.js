// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {message, PageHeader} from "antd";

import PageForm from "./PageForm";
import {updatePage} from "../../modules/pages/actions";

const PageEditView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const fetchingPages = useSelector(state => state.pages.isFetching);
    const page = useSelector(state =>
        state.pages.items.find(p => p.id.toString() === match.params.id.toString()));

    if (fetchingPages) return <div>Loading...</div>;
    if (!page) return <div>Page not found</div>;  // TODO: Nice error

    const onFinish = async v => {
        console.log("saving page", v);
        const result = await dispatch(updatePage(page.id, v));
        if (!result.error) {
            message.success(`Saved changes to page: ${result.data.title}`);
        }
    };

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title={`Edit Page: ${page.title}`}
        subTitle="Press submit to save your changes."
    >
        <PageForm initialValues={page} onFinish={onFinish} />
    </PageHeader>;
};

export default PageEditView;
