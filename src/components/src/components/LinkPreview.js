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

// src/components/LinkPreview.css
.link-preview {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  background-color: #f6f8fa;
}

.link-preview-content {
  flex: 1;
}

.link-image-container {
  width: 100px;
  height: 100px;
  margin-left: 12px;
  overflow: hidden;
}

.link-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.link-description {
  margin: 0 0 8px;
  font-size: 14px;
  color: #586069;
}

.link-url {
  font-size: 12px;
  color: #0366d6;
}

.loading, .error {
  padding: 12px;
  text-align: center;
  color: #586069;
}

// src/components/LinkItem.css
.link-item {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  background-color: #ffffff;
}

.link-item-content {
  flex: 1;
}

.link-image-container {
  width: 100px;
  height: 100px;
  margin-left: 12px;
  overflow: hidden;
}

.link-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.link-description {
  margin: 0 0 8px;
  font-size: 14px;
  color: #586069;
}

.link-url {
  font-size: 12px;
  color: #0366d6;
  text-decoration: none;
}

.link-url:hover {
  text-decoration: underline;
}

.link-tags {
  margin-top: 8px;
}

.link-tag {
  display: inline-block;
  padding: 2px 6px;
  margin-right: 4px;
  background-color: #f1f8ff;
  color: #0366d6;
  font-size: 12px;
  border-radius: 3px;
}

// src/components/LinkList.css
.link-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.link-list h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}