import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {Button, Modal} from "antd";

import {APP_BASE_URL} from "../config";
import {useAppSelector} from "../hooks";
import {useStations} from "../modules/stations/hooks";

const MODAL_PREFIX = `${APP_BASE_URL}/modals/`;
const PAGE_PREFIX = `${APP_BASE_URL}/pages/`;
const STATION_PREFIX = `${APP_BASE_URL}/stations/`;

const byIdFactory = items => () =>  Object.fromEntries((items ?? []).map(obj => [obj.id, obj]));

interface HTMLContentProps {
  id: string;
  htmlContent: string;
}

const HTMLContent = React.memo(({id, htmlContent}: HTMLContentProps) => {
  const navigate = useNavigate();

  const modals = useAppSelector(state => state.modals.items);
  const modalsById = useMemo(byIdFactory(modals), [modals]);

  const pages = useAppSelector(state => state.pages.items);
  const pagesById = useMemo(byIdFactory(pages), [pages]);

  const {items: stations} = useStations();
  const stationsById = useMemo(byIdFactory(stations), [stations]);

  const [modalShown, setModalShown] = useState(null);
  const hideModal = useCallback(() => setModalShown(null), []);

  const addHrefHandlers = useCallback(anchorEl => {
    const href = anchorEl.getAttribute("href");
    if (!href) return;
    if (href.startsWith(MODAL_PREFIX)) {
      anchorEl.addEventListener("click", e => {
        e.preventDefault();
        const modalId = href.replace(MODAL_PREFIX, "");
        if (modalsById.hasOwnProperty(modalId)) setModalShown(modalsById[modalId]);
      });
    } else if (href.startsWith(PAGE_PREFIX)) {
      anchorEl.addEventListener("click", e => {
        e.preventDefault();
        const pageId = href.replace(PAGE_PREFIX, "");
        if (pagesById.hasOwnProperty(pageId)) navigate(`/pages/detail/${pageId}`);
      });
    } else if (href.startsWith(STATION_PREFIX)) {
      anchorEl.addEventListener("click", e => {
        e.preventDefault();
        const stationId = href.replace(STATION_PREFIX, "");
        if (stationsById.hasOwnProperty(stationId)) navigate(`/stations/detail/${stationId}`);
      });
    }
  }, [modalsById, pagesById, stationsById, navigate]);

  useEffect(() => {
    if (!htmlContent) return;
    document.querySelectorAll(`#${id} a`).forEach(addHrefHandlers);
    if (modalShown) document.querySelectorAll(`#${id}-modal a`).forEach(addHrefHandlers);
  }, [htmlContent, addHrefHandlers, modalShown]);

  /** @type React.ReactNode */
  const footer = useMemo(
    () => <Button onClick={hideModal}>{modalShown?.close_text}</Button>,
    [hideModal, modalShown]);

  const modalContentObj = useMemo(() => ({__html: modalShown?.content}), [modalShown]);
  const htmlContentObj = useMemo(() => ({__html: htmlContent}), [htmlContent]);

  return <div>
    <Modal
      width={640}
      open={modalShown !== null}
      onCancel={hideModal}
      title={modalShown?.title}
      footer={footer}
    >
      {modalShown
        ? <div className="html-content" id={`${id}-modal`} dangerouslySetInnerHTML={modalContentObj} />
        : null}
    </Modal>
    <div className="html-content" id={id} dangerouslySetInnerHTML={htmlContentObj} />
  </div>;
});

export default HTMLContent;
