import { open } from '@tauri-apps/plugin-dialog';
import { FC } from 'react';

interface CreateFileLinkDirInputProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  description: string;
}
export const CreateFileLinkDirInput: FC<CreateFileLinkDirInputProps> = ({ value, onChange, title, description }) => {
  const openSelection = async () => {
    const selection = await open({
      directory: true,
    });
    if (selection) onChange(selection);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h3 className="font-bold text-lg prose">{title}</h3>
      <p className="prose">{description}</p>

      <div className="join w-full px-3">
        <button className="btn btn-sm btn-info join-item" onClick={openSelection}>
          Browse
        </button>
        <input className="input input-sm input-bordered join-item w-full" type="text" placeholder="e.g., C:\Users\YourName\Documents\YourFolder" onChange={e => onChange(e.target.value)} value={value} />
      </div>
    </div>
  );
};
