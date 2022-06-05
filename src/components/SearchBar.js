import React, {useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {AutoComplete, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

import {performSearch} from "../modules/search/actions";
import {ACCESS_TOKEN_READ} from "../utils";

const SearchBar = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingAuth,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const searchData = useSelector(state => state.search.data);
  // const searchFetching = useSelector(state => state.search.isFetching);

  const onSearch = useCallback(async v => {
    if (!v) return;
    const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_READ);
    dispatch(performSearch({}, {"q": v}, accessToken));
  }, [getAccessTokenSilently]);

  const onSelect = useCallback(([cat, id]) => navigate(`/${cat}/detail/${id}`), [navigate]);

  const options = useMemo(() => Object.entries(searchData)
    .filter(r => r[1].length)
    .map(([sName, sValues]) => ({
      label: <span>{sName}</span>,
      options: sValues.map(r => ({
        value: [sName, r.id],
        label: <div>{r.title}</div>,
      })),
    })), [searchData]);

  return <AutoComplete style={{marginTop: "12px", width: "100%", float: "right"}}
                       onSelect={onSelect}
                       onSearch={onSearch}
                       options={options}
                       disabled={isLoadingAuth || !isAuthenticated}>
    {/* TODO: set disabled to !isAuthenticated once it actually does something */}
    <Input size="large"
           placeholder="Type to search stations, pages, and modals"
           prefix={<SearchOutlined />}/>
  </AutoComplete>;
});

export default SearchBar;
