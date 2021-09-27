import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import {PageHeader} from "antd";

import PageForm from "./PageForm";

const PageEditView = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const page = useSelector(state =>
        state.pages.items.find(p => p.id.toString() === match.params.id.toString()));

    if (!page) return <div>Page not found</div>;  // TODO: Nice error

    return <PageHeader
        onBack={() => history.goBack()}
        ghost={false}
        title={`Edit Page: ${page.title}`}
        subTitle="Press submit to save your changes."
    >
        <PageForm initialValues={page} />
    </PageHeader>;
};

export default PageEditView;
