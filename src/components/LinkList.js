import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

function LinkList() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'links'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const linksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLinks(linksList);
    });

    return () => unsubscribe();
  }, []);

  return (
    
      Your Links
      
        {links.map(link => (
          
            {link.url}
            Tags: {link.tags.join(', ')}
          
        ))}
      
    
  );
}

export default LinkList;