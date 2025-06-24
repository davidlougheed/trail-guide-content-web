// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import {useAppDispatch} from "../../hooks";
import {addSection} from "../../modules/sections/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

import SectionForm from "./SectionForm";
import {useSections} from "../../modules/sections/hooks";

const SectionAddView = React.memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {getAccessTokenSilently} = useAuth0();

  const {isAdding: addingSection} = useSections();

  const onFinish = useCallback(async v => {
    console.log("adding section", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(addSection(v.id, v, accessToken));
    if (!result.error) {
      message.success(`Added new section: ${result.data.title}`);
      navigate(`/sections/detail/${result.data.id}`, {replace: true});
    }
  }, [getAccessTokenSilently, dispatch, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={goBack}
    ghost={false}
    title="Add Section"
    subTitle="Create a new app section (e.g., a trail)"
  >
    <SectionForm onFinish={onFinish} loading={addingSection} localDataKey="tgcw:section:add" />
  </PageHeader>;
});

export default SectionAddView;
