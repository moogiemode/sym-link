import { CreateFileLinkSteps } from './CreateFileLinkSteps';

export const CreateFileLinkButton = () => {
  const openModal = () => (document.getElementById('create-new-link-modal') as HTMLFormElement).showModal();

  return (
    <>
      <button className="btn btn-sm btn-accent" onClick={openModal}>
        Create New Link
      </button>
      <dialog id="create-new-link-modal" className="modal">
        <div className="modal-box p-8">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none">✕</button>
          </form>
          <CreateFileLinkSteps />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
