import {ADD_MODAL, FETCH_MODALS, UPDATE_MODAL} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {Modal} from "./types";

export default makeGenericNetworkReducer<Modal>(FETCH_MODALS, ADD_MODAL, UPDATE_MODAL);
