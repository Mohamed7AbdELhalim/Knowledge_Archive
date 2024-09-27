// src/components/LinkItem.js
import React from 'react';
import './LinkItem.css';

const LinkItem = ({ link }) => {
  return (
    <div className="link-item">
      <div className="link-item-content">
        <h3 className="link-title">{link.title}</h3>
        <p className="link-description">{link.description}</p>
        <a href={link.url} className="link-url" target="_blank" rel="noopener noreferrer">
          {link.url}
        </a>
        {link.tags && link.tags.length > 0 && (
          <div className="link-tags">
            {link.tags.map((tag, index) => (
              <span key={index} className="link-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      {link.image && (
        <div className="link-image-container">
          <img src={link.image} alt="Link preview" className="link-image" />
        </div>
      )}
    </div>
  );
};

export default LinkItem;

// src/components/LinkList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import LinkItem from './LinkItem';
import './LinkList.css';

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
    <div className="link-list">
      <h2>Your Links</h2>
      {links.map(link => (
        <LinkItem key={link.id} link={link} />
      ))}
    </div>
  );
}

export default LinkList;
