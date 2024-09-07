import {useAppSelector} from "../../hooks";

export const useSections = () => useAppSelector(state => state.sections);
