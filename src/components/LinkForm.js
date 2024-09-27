import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function LinkForm() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'links'), {
        url,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: new Date()
      });
      setUrl('');
      setTags('');
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  return (
    
      <input
        type="url"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      Add Link
    
  );
}

export default LinkForm;