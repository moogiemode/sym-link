import { useState } from 'react';
import './App.css';
import { CreateFileLinkButton } from './components/CreateFileLinkButton';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CreateFileLinkButton />
    </>
  );
}

export default App;
