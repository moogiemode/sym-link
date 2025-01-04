import { FileIcon } from '@/icons/FileIcon';
import { FolderIcon } from '@/icons/FolderIcon';
import { FileEntry } from '@/types';
import { FC } from 'react';

interface CreateFileLinkStepsSelectTableRowProps {
  file: FileEntry;
  disableCheckbox: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CreateFileLinkStepsSelectTableRow: FC<CreateFileLinkStepsSelectTableRowProps> = ({ file, disableCheckbox, checked, onChange }) => {
  return (
    <tr>
      <th>
        <label className={disableCheckbox ? 'tooltip tooltip-right tooltip-error' : undefined} data-tip={disableCheckbox ? 'Already exists in the destination folder' : undefined}>
          <input type="checkbox" className="checkbox checkbox-sm checked:checkbox-accent" onChange={e => onChange(e.target.checked)} disabled={disableCheckbox} checked={checked} />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-2">
          <div className="avatar">{file.isDirectory ? <FolderIcon className="size-5" /> : <FileIcon className="size-5" />}</div>
          <div>
            <div className="font-bold text-ellipsis whitespace-nowrap">{file.name}</div>
          </div>
        </div>
      </td>
    </tr>
  );
};
