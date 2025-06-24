// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {memo, useCallback, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import {useAppDispatch} from "../../hooks";
import {updateCategory} from "../../modules/categories/actions";
import {useCategories} from "../../modules/categories/hooks";
import {Category} from "../../modules/categories/types";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

import CategoryForm from "./CategoryForm";

const CategoryEditView = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id: categoryID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const {items: categories, isFetching, isUpdating} = useCategories();

  const category = useMemo(() => findItemByID<Category>(categories, categoryID), [categories, categoryID]);

  const onFinish = useCallback(async (v) => {
    console.log("saving category", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateCategory(category.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to category: ${result.data.id}`);
    }
  }, [getAccessTokenSilently, dispatch, category]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title={isFetching ? "Loading..." : (category ? `Edit Category: ${category.id}` : "Category not found")}
    subTitle={category ? "Press submit to save your changes." : ""}
  >
    {category && <CategoryForm initialValues={category} onFinish={onFinish} loading={isUpdating} />}
  </PageHeader>;
});

export default CategoryEditView;
