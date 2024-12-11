import { useState } from 'react';
import { CreateFileLinkSteps } from './CreateFileLinkSteps';

export const CreateFileLinkButton = () => {
  const [creationSteps, setCreationSteps] = useState(0);

  const openModal = () => (document.getElementById('create-new-link-modal') as HTMLFormElement).showModal();

  return (
    <>
      <button className="btn btn-sm btn-accent" onClick={openModal}>
        Create New Link
      </button>
      <dialog id="create-new-link-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none">✕</button>
          </form>
          <CreateFileLinkSteps />
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
