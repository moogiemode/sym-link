import { useState } from 'react';

export const App = () => {
  const [titleState, setTitleState] = useState('this is my new title');

  const openDialog = async () => {
    const path = await window.electronAPI.openDialog();
    console.log(path);
  };

  return (
    <div>
      <input value={titleState} onChange={e => setTitleState(e.target.value)} />
      <button onClick={openDialog}>Set Title</button>
      <h1>💖 Hello World!</h1> <p>Welcome to your Electron application.</p>
    </div>
  );
};
