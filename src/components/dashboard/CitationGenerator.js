import React, { useState, useEffect } from 'react';
import './CitationGenerator.css';

const CitationGenerator = () => {
  const [citationType, setCitationType] = useState('website');
  const [citationStyle, setCitationStyle] = useState('MLA');
  const [websiteData, setWebsiteData] = useState({
    title: '',
    url: '',
    author: '',
    date: '',
  });
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
  });
  const [journalData, setJournalData] = useState({
    title: '',
    author: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    year: '',
  });
  const [citation, setCitation] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

  useEffect(() => {
    generateCitation();
  }, [websiteData, bookData, journalData, citationStyle]);

  const handleCitationTypeChange = (type) => {
    setCitationType(type);
    setCitation(''); // Clear citation when switching type
  };

  const handleCitationStyleChange = (style) => {
    setCitationStyle(style);
  };

  const handleDataChange = (dataType, field, value) => {
    if (dataType === 'website') {
      setWebsiteData((prevData) => ({ ...prevData, [field]: value }));
    } else if (dataType === 'book') {
      setBookData((prevData) => ({ ...prevData, [field]: value }));
    } else if (dataType === 'journal') {
      setJournalData((prevData) => ({ ...prevData, [field]: value }));
    }
  };

  const generateCitation = () => {
    let generatedCitation = '';
    if (citationType === 'website') {
      generatedCitation = generateWebsiteCitation();
    } else if (citationType === 'book') {
      generatedCitation = generateBookCitation();
    } else if (citationType === 'journal') {
      generatedCitation = generateJournalCitation();
    }
    setCitation(generatedCitation);
  };

  const generateWebsiteCitation = () => {
    const { title, url, author, date } = websiteData;
    switch (citationStyle) {
      case 'MLA':
        return `${author}. "${title}." ${url}, ${date}.`;
      case 'APA':
        return `${author}. (${date}). ${title}. ${url}.`;
      case 'Chicago':
        return `${author}, "${title}", accessed ${date}, ${url}.`;
      case 'IEEE':
        return `[1] ${author}, "${title}", ${url}. (accessed ${date})`;
      default:
        return '';
    }
  };

  const generateBookCitation = () => {
    const { title, author, publisher, year } = bookData;
    switch (citationStyle) {
      case 'MLA':
        return `${author}. ${title}. ${publisher}, ${year}.`;
      case 'APA':
        return `${author}. (${year}). ${title}. ${publisher}.`;
      case 'Chicago':
        return `${author}, ${title} (${publisher}, ${year}).`;
      case 'IEEE':
        return `[1] ${author}, ${title}. ${publisher}, ${year}.`;
      default:
        return '';
    }
  };

  const generateJournalCitation = () => {
    const { title, author, journal, volume, issue, pages, year } = journalData;
    switch (citationStyle) {
      case 'MLA':
        return `${author}. "${title}." ${journal} ${volume}.${issue} (${year}): ${pages}.`;
      case 'APA':
        return `${author}. (${year}). ${title}. ${journal}, ${volume}(${issue}), ${pages}.`;
      case 'Chicago':
        return `${author}, "${title}," ${journal} ${volume}, no. ${issue} (${year}): ${pages}.`;
      case 'IEEE':
        return `[1] ${author}, "${title}," ${journal}, vol. ${volume}, no. ${issue}, p. ${pages}, ${year}.`;
      default:
        return '';
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(citation);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy to Clipboard');
    }, 2000);
  };

  return (
    <div className="citation-generator-container">
      {/* Citation Type Buttons */}
      <div className="button-group">
        <button
          className={`type-button ${citationType === 'website' ? 'active' : ''}`}
          onClick={() => handleCitationTypeChange('website')}
        >
          Website
        </button>
        <button
          className={`type-button ${citationType === 'book' ? 'active' : ''}`}
          onClick={() => handleCitationTypeChange('book')}
        >
          Book
        </button>
        <button
          className={`type-button ${citationType === 'journal' ? 'active' : ''}`}
          onClick={() => handleCitationTypeChange('journal')}
        >
          Journal
        </button>
      </div>

      {/* Citation Style Buttons */}
      <div className="button-group">
        <button
          className={`style-button ${citationStyle === 'MLA' ? 'active' : ''}`}
          onClick={() => handleCitationStyleChange('MLA')}
        >
          MLA
        </button>
        <button
          className={`style-button ${citationStyle === 'APA' ? 'active' : ''}`}
          onClick={() => handleCitationStyleChange('APA')}
        >
          APA
        </button>
        <button
          className={`style-button ${citationStyle === 'Chicago' ? 'active' : ''}`}
          onClick={() => handleCitationStyleChange('Chicago')}
        >
          Chicago
        </button>
        <button
          className={`style-button ${citationStyle === 'IEEE' ? 'active' : ''}`}
          onClick={() => handleCitationStyleChange('IEEE')}
        >
          IEEE
        </button>
      </div>

      {/* Citation Form */}
      <div className="form-container">
        {citationType === 'website' && (
          <>
            <input
              type="text"
              placeholder="Enter website title"
              value={websiteData.title}
              onChange={(e) => handleDataChange('website', 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter website URL"
              value={websiteData.url}
              onChange={(e) => handleDataChange('website', 'url', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter author name"
              value={websiteData.author}
              onChange={(e) => handleDataChange('website', 'author', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter publication date"
              value={websiteData.date}
              onChange={(e) => handleDataChange('website', 'date', e.target.value)}
            />
          </>
        )}

        {citationType === 'book' && (
          <>
            <input
              type="text"
              placeholder="Enter book title"
              value={bookData.title}
              onChange={(e) => handleDataChange('book', 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter author name"
              value={bookData.author}
              onChange={(e) => handleDataChange('book', 'author', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter publisher"
              value={bookData.publisher}
              onChange={(e) => handleDataChange('book', 'publisher', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter publication year"
              value={bookData.year}
              onChange={(e) => handleDataChange('book', 'year', e.target.value)}
            />
          </>
        )}

        {citationType === 'journal' && (
          <>
            <input
              type="text"
              placeholder="Enter journal title"
              value={journalData.title}
              onChange={(e) => handleDataChange('journal', 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter author name"
              value={journalData.author}
              onChange={(e) => handleDataChange('journal', 'author', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter journal name"
              value={journalData.journal}
              onChange={(e) => handleDataChange('journal', 'journal', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter volume"
              value={journalData.volume}
              onChange={(e) => handleDataChange('journal', 'volume', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter issue"
              value={journalData.issue}
              onChange={(e) => handleDataChange('journal', 'issue', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter page numbers"
              value={journalData.pages}
              onChange={(e) => handleDataChange('journal', 'pages', e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter publication year"
              value={journalData.year}
              onChange={(e) => handleDataChange('journal', 'year', e.target.value)}
            />
          </>
        )}
      </div>

      {/* Citation Output */}
      <div className="citation-output">
        <pre>{citation}</pre>
        <button className="copy-button" onClick={handleCopyToClipboard}>
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default CitationGenerator;
