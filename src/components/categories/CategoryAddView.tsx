// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import {useAppDispatch} from "../../hooks";
import {addCategory} from "../../modules/categories/actions";
import {useCategories} from "../../modules/categories/hooks";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

import CategoryForm from "./CategoryForm";

const CategoryAddView = React.memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const {isAdding: addingCategory} = useCategories();

  const onFinish = useCallback(async v => {
    console.log("adding category", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addCategory(v.id, v, accessToken));
    if (!result.error) {
      message.success(`Added new category: ${result.data.id}`);
      navigate(`/categories/detail/${result.data.id}`, {replace: true});
    }
  }, [getAccessTokenSilently, dispatch, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={goBack}
    ghost={false}
    title="Add Category"
    subTitle="Create a new app category, with an icon (e.g., 'research', 'culture')"
  >
    <CategoryForm onFinish={onFinish} loading={addingCategory} localDataKey="tgcw:category:add" />
  </PageHeader>;
});

export default CategoryAddView;
