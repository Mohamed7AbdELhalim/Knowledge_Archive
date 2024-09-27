// src/components/LinkPreview.js
import React, { useState, useEffect } from 'react';

const LinkPreview = ({ url, onMetadataFetch }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.status === 'success') {
          setMetadata(data.data);
          onMetadataFetch(data.data);
        } else {
          throw new Error('Failed to fetch metadata');
        }
      } catch (err) {
        setError('Error fetching link preview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url, onMetadataFetch]);

  if (loading) return <p>Loading preview...</p>;
  if (error) return <p>{error}</p>;
  if (!metadata) return null;

  return (
    <div className="link-preview">
      {metadata.image && <img src={metadata.image.url} alt="Link preview" />}
      <h3>{metadata.title}</h3>
      <p>{metadata.description}</p>
    </div>
  );
};

export default LinkPreview;

// src/components/LinkForm.js
import React, { useState, useCallback } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import LinkPreview from './LinkPreview';

function LinkForm() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [metadata, setMetadata] = useState(null);

  const handleMetadataFetch = useCallback((fetchedMetadata) => {
    setMetadata(fetchedMetadata);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'links'), {
        url,
        tags: tags.split(',').map(tag => tag.trim()),
        title: metadata?.title || '',
        description: metadata?.description || '',
        image: metadata?.image?.url || '',
        createdAt: new Date()
      });
      setUrl('');
      setTags('');
      setMetadata(null);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <LinkPreview url={url} onMetadataFetch={handleMetadataFetch} />
      <button type="submit">Add Link</button>
    </form>
  );
}

export default LinkForm;