// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {memo, useCallback, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {message, PageHeader} from "antd";

import {useAppDispatch} from "../../hooks";
import {updateSection} from "../../modules/sections/actions";
import {useSections} from "../../modules/sections/hooks";
import {Section} from "../../modules/sections/types";
import {ACCESS_TOKEN_MANAGE, findItemByID} from "../../utils";

import SectionForm from "./SectionForm";

const SectionEditView = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id: sectionID} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const {items: sections, isFetching, isUpdating} = useSections();

  const section = useMemo(() => findItemByID<Section>(sections, sectionID), [sections, sectionID]);

  const onFinish = useCallback(async (v) => {
    console.log("saving section", v);
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
    const result = await dispatch(updateSection(section.id, v, accessToken));
    if (!result.error) {
      message.success(`Saved changes to section: ${result.data.title}`);
    }
  }, [getAccessTokenSilently, dispatch, section]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return <PageHeader
    onBack={onBack}
    ghost={false}
    title={isFetching ? "Loading..." : (section ? `Edit Section: ${section.title}` : "Section not found")}
    subTitle={section ? "Press submit to save your changes." : ""}
  >
    {section && <SectionForm initialValues={section} onFinish={onFinish} loading={isUpdating} />}
  </PageHeader>;
});

export default SectionEditView;
