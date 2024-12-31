import { useState } from 'react';
import { CreateFileLinkButton } from './createFileLink/CreateFileLinkButton';
// import { LinkedFilesDisplay } from './linkedFilesDisplay/LinkedFilesDisplay';

export const App = () => {
  const [titleState, setTitleState] = useState('this is my new title');

  const openDialog = async () => {
    const path = await window.electronAPI.openDialog();
    console.log(path);
  };

  return (
    <>
      <button onClick={async () => await window.electronAPI.saveSettings({apple: "banana"})}>Open Dialog</button>
      <CreateFileLinkButton />
      {/* <LinkedFilesDisplay /> */}
    </>
  );
};
