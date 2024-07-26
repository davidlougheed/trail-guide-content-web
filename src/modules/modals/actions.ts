import type {AnyAction} from "redux";
import type {ThunkAction} from "redux-thunk";

import {makeIfNeededAction, networkAction, type NetworkActionResponse, networkActionTypes} from "../../utils";
import type {Modal} from "./types";
import type {AppDispatch, RootState, RootStateGetter} from "../../store";

export const FETCH_MODALS = networkActionTypes("FETCH_MODALS");
export const ADD_MODAL = networkActionTypes("ADD_MODAL");
export const UPDATE_MODAL = networkActionTypes("UPDATE_MODAL");

const fetchModals = networkAction<Modal>(FETCH_MODALS, "/modals");
export const fetchModalsIfNeeded = makeIfNeededAction<Modal>(fetchModals, "modals");

const _addModal = networkAction<Modal, Modal>(ADD_MODAL, "/modals", "POST");
export const addModal = (body: Modal, accessToken: string) => (dispatch: AppDispatch, getState: RootStateGetter) => {
  const state = getState();
  if (state.modals.isFetching || state.modals.isAdding || state.modals.isUpdating) return;
  return dispatch(_addModal(body, {}, accessToken));
};

export const updateModal = (
  modalID: string,
  modalData: Modal,
  accessToken: string,
): ThunkAction<Promise<NetworkActionResponse<Modal>>, RootState, unknown, AnyAction> =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (state.modals.isFetching || state.modals.isAdding || state.modals.isUpdating) return;
    return dispatch(networkAction<Modal, Modal>(UPDATE_MODAL, `/modals/${modalID}`, "PUT")(
      modalData, {}, accessToken));
  };
