// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import PageForm from "./PageForm";
import {updatePage} from "../../modules/pages/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const PageEditView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id: pageID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingPages = useSelector(state => state.pages.isFetching);
  const updatingPage = useSelector(state => state.pages.isUpdating);
  const page = useSelector(state => findItemByID(state.pages.items, pageID));

  if (fetchingPages) return <div>Loading...</div>;
  if (!page) return <div>Page not found</div>;  // TODO: Nice error

  const onFinish = async pageData => {
    console.log("saving page", pageData);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updatePage(page.id, pageData, accessToken));
    if (!result.error) {
      message.success(`Saved changes to page: ${result.data.title}`);
    }
  };

  return <PageHeader
    onBack={() => navigate(-1)}
    ghost={false}
    title={`Edit Page: ${page.title}`}
    subTitle="Press submit to save your changes."
  >
    <PageForm initialValues={page} onFinish={onFinish} loading={updatingPage} />
  </PageHeader>;
};

export default PageEditView;
