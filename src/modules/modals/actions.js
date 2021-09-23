import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_MODALS = networkActionTypes("FETCH_MODALS");
export const ADD_MODAL = networkActionTypes("ADD_MODAL");
export const UPDATE_MODAL = networkActionTypes("UPDATE_MODAL");

const fetchModals = networkAction(FETCH_MODALS, "/modals");
export const fetchModalsIfNeeded = makeIfNeededAction(fetchModals, "modals");

const _addModal = networkAction(ADD_MODAL, "/modals", "POST");
export const addModal = body => (dispatch, getState) => {
    const state = getState();
    if (state.isFetching || state.isAdding || state.isUpdating) return;
    return _addModal(body);
};

export const updateStation = (modalID, modalData) => (dispatch, getState) => {
    const state = getState();
    if (state.isFetching || state.isAdding || state.isUpdating) return;
    return dispatch(networkAction(UPDATE_MODAL, `/modals/${modalID}`, "PUT")(modalData));
}
