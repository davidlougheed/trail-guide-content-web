// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import PageForm from "./PageForm";
import {updatePage} from "../../modules/pages/actions";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

const PageEditView = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id: pageID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const fetchingPages = useSelector(state => state.pages.isFetching);
  const updatingPage = useSelector(state => state.pages.isUpdating);
  const page = useSelector(state => findItemByID(state.pages.items, pageID));

  const onFinish = useCallback(async pageData => {
    console.log("saving page", pageData);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updatePage(page.id, pageData, accessToken));
    if (!result.error) {
      message.success(`Saved changes to page: ${result.data.title}`);
    }
  }, [getAccessTokenSilently, dispatch, page]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  const title = useMemo(
    () => fetchingPages ? "Loading..." : (page ? `Edit Page: ${page.title}` : "Page not found"),
    [fetchingPages, page]);
  const subtitle = useMemo(() => page ? "Press submit to save your changes." : "", [page]);

  return <PageHeader onBack={onBack} ghost={false} title={title} subTitle={subtitle}>
    {page && <PageForm initialValues={page} onFinish={onFinish} loading={updatingPage} />}
  </PageHeader>;
});

export default PageEditView;
