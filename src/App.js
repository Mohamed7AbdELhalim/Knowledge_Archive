import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Auth from './components/Auth';
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';
import Search from './components/Search';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (searchTerm) => {
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    
      Link Organization App
      {user ? (
        <>
          <button onClick={() => auth.signOut()}>Sign Out
          
          
          
        </>
      ) : (
        
      )}
    
  );
}

export default App;