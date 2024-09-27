// src/components/LinkPreview.js
import React, { useState, useEffect } from 'react';
import './LinkPreview.css';

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

  if (loading) return <div className="link-preview loading">Loading preview...</div>;
  if (error) return <div className="link-preview error">{error}</div>;
  if (!metadata) return null;

  return (
    <div className="link-preview">
      <div className="link-preview-content">
        <h3 className="link-title">{metadata.title}</h3>
        <p className="link-description">{metadata.description}</p>
        <span className="link-url">{metadata.url}</span>
      </div>
      {metadata.image && (
        <div className="link-image-container">
          <img src={metadata.image.url} alt="Link preview" className="link-image" />
        </div>
      )}
    </div>
  );
};

export default LinkPreview;
