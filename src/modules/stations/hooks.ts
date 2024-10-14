import {useAppSelector} from "../../hooks";

export const useStations = () => useAppSelector(state => state.stations);
