import {useCallback} from "react";
import {useSearchParams} from "react-router-dom";

export const useUrlPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || 1, 10);
  const pageSize = parseInt(searchParams.get("pageSize") || 10, 10);
  const onChange = useCallback((page_, pageSize_) => {
    setSearchParams({page: page_, pageSize: pageSize_});
  }, []);

  return {current: page, pageSize, onChange, size: "default"};
};
