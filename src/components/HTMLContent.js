import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal} from "antd";

import {APP_BASE_URL} from "../config";

const MODAL_PREFIX = `${APP_BASE_URL}/modals/`;
const PAGE_PREFIX = `${APP_BASE_URL}/pages/`;

const HTMLContent = React.memo(({id, htmlContent}) => {
  const navigate = useNavigate();

  const modals = useSelector(state => state.modals.items);
  const modalsById = useMemo(() => Object.fromEntries((modals ?? []).map(m => [m.id, m])), [modals]);

  const pages = useSelector(state => state.pages.items);
  const pagesById = useMemo(() => Object.fromEntries((pages ?? []).map(m => [m.id, m])), [pages]);

  const [modalShown, setModalShown] = useState(null);
  const hideModal = useCallback(() => setModalShown(null), []);

  useEffect(() => {
    if (!htmlContent || !modalsById) return;

    document.querySelectorAll(`#${id} a`).forEach(anchorEl => {
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
          if (pagesById.hasOwnProperty(pageId)) {
            navigate(`/pages/detail/${pageId}`);
          }
        });
      }
    });
  }, [htmlContent, modalsById, navigate, pagesById]);

  return <div>
    <Modal
      width={640}
      visible={modalShown !== null}
      onCancel={hideModal}
      title={modalShown?.title}
      footer={<Button onClick={hideModal}>{modalShown?.close_text}</Button>}
    >
      {modalShown ? <div className="html-content" dangerouslySetInnerHTML={{__html: modalShown.content}} /> : null}
    </Modal>
    <div className="html-content" id={id} dangerouslySetInnerHTML={{__html: htmlContent}} />
  </div>;
});

export default HTMLContent;
