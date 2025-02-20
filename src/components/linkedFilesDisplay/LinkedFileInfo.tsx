import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { LinkIcon } from '@/icons/LinkIcon';
import { LinkedFolder } from '@/types';
import { deleteSymLinks } from '@/utils';
import { FC, useRef, useState } from 'react';
import { AddLinksModalContent } from './AddLinksModalContent';

export const LinkedFileInfo: FC<{ linkedFile: LinkedFolder | string }> = ({ linkedFile }) => {
  const { dirKey, linkedFiles, sourceDirName, outputDirName, sourceDirPath, outputDirPath, allFolderItemsSynced, filesSynced, timeSynced } = typeof linkedFile === 'string' ? {} : linkedFile;

  const menuRef = useRef<HTMLDetailsElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const menuListRef = useRef<HTMLUListElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const syncStatus =
    filesSynced.length === linkedFiles.length
      ? { className: 'text-success', text: 'All Good' }
      : filesSynced.length === 0
        ? { className: 'text-error', text: 'All Synced Files are Missing' }
        : { className: 'text-warning', text: 'Some Files are Missing' };

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // const refreshLinks = async () => {
  //   await createSymLinks({ sourceDir: sourceDirPath, outputDir: outputDirPath, filesToLink: [], allFolderItemsSynced });
  //   menuRef.current.open = false;
  // };

  const deleteLinks = async () => {
    await deleteSymLinks({ sourceDir: sourceDirPath, outputDir: outputDirPath });
    menuRef.current.open = false;
  };

  const openAddLinksModal = () => {
    setModalOpen(true);
    (document.getElementById('add-links-modal') as HTMLFormElement).showModal();
    menuRef.current.open = false;
  };

  const onAddLinkModalClose = () => {
    setModalOpen(false);
    // (document.getElementById('add-links-modal') as HTMLFormElement).close();
  };

  const onDropdownBlur = () =>
    // set the visibility of the menuRef to hidden
    {
      if (menuListRef.current) menuListRef.current.style.opacity = '0';

      timeoutRef.current = setTimeout(() => {
        if (menuRef.current) menuRef.current.open = false;
        if (menuListRef.current) menuListRef.current.style.opacity = '1';
      }, 1000);
    };

    const onMenuOpen = () => {
      if (menuListRef.current) menuListRef.current.style.opacity = '1';
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

  return (
    <>
      <details className="dropdown dropdown-bottom dropdown-end" ref={menuRef} onBlur={onDropdownBlur} onClick={onMenuOpen}>
        <summary className="flex items-center bg-base-200 gap-3 p-2 rounded-md hover:bg-base-300" tabIndex={0} role="button">
          <div className="avatar size-14 bg-base-300 mask mask-squircle">
            <div>
              <div className="flex justify-center items-center h-full w-full">
                <LinkIcon />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="font-bold">{sourceDirName}</div>
                <ArrowRightIcon className="size-6" />
                <div className="font-bold">{outputDirName}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`badge badge-primary ${allFolderItemsSynced ? '' : 'badge-outline'}`}>{allFolderItemsSynced ? 'full' : 'partial'}</div>
                <div className="badge badge-accent">{linkedFiles.length}</div>
              </div>
            </div>
            <div className="text-sm opacity-75">{`${sourceDirPath} → ${outputDirPath}`}</div>
            <div className="flex justify-between gap-3 items-center">
              <div className="text-sm opacity-40">Last Synced: {new Date(timeSynced).toLocaleString()}</div>
              <div className={`flex text-xs opacity-50 prose`}>
                <div>Sync Status:&nbsp;</div>
                <div className={syncStatus.className}>{syncStatus.text}</div>
              </div>
            </div>
          </div>
        </summary>
        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-md z-[1] w-52 p-2 shadow" ref={menuListRef}>
          {/* <li>
            <button onClick={refreshLinks}>Refresh</button>
          </li> */}
          <li>
            <button onClick={deleteLinks}>Delete</button>
          </li>
          <li>
            <button onClick={openAddLinksModal}>Add Links</button>
          </li>
        </ul>
      </details>
      <dialog id="add-links-modal" className="modal" ref={modalRef}>
        <div className="modal-box p-8 overflow-hidden  flex flex-col gap-8 h-full">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none" onClick={onAddLinkModalClose}>
              ✕
            </button>
          </form>
          {modalOpen && <AddLinksModalContent dirKey={dirKey} onModalClose={onAddLinkModalClose} />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onAddLinkModalClose}>close</button>
        </form>
      </dialog>
    </>
  );
};
