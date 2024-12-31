import { useState } from 'react';
// import { CreateFileLinkButton } from './createFileLink/CreateFileLinkButton';
// import { LinkedFilesDisplay } from './linkedFilesDisplay/LinkedFilesDisplay';

export const App = () => {
  return (
    <>
      <button onClick={async () => await window.electronAPI.getAppDataPath().then(res => console.log(res))}>Open Dialog</button>
    </>
  );
};
