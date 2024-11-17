import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from '@/components/ui/alert';

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
  const [showAlert, setShowAlert] = useState(false);

  const handleCitationTypeChange = (type) => {
    setCitationType(type);
    setCitation('');
  };

  const handleCitationStyleChange = (style) => {
    setCitationStyle(style);
    generateCitation();
  };

  const handleWebsiteDataChange = (field, value) => {
    setWebsiteData((prevData) => ({ ...prevData, [field]: value }));
    generateCitation();
  };

  const handleBookDataChange = (field, value) => {
    setBookData((prevData) => ({ ...prevData, [field]: value }));
    generateCitation();
  };

  const handleJournalDataChange = (field, value) => {
    setJournalData((prevData) => ({ ...prevData, [field]: value }));
    generateCitation();
  };

  const generateCitation = () => {
    let citation = '';
    if (citationType === 'website') {
      citation = generateWebsiteCitation();
    } else if (citationType === 'book') {
      citation = generateBookCitation();
    } else if (citationType === 'journal') {
      citation = generateJournalCitation();
    }
    setCitation(citation);
  };

  const generateWebsiteCitation = () => {
    switch (citationStyle) {
      case 'MLA':
        return `${websiteData.author}. "${websiteData.title}." ${websiteData.url}, ${websiteData.date}.`;
      case 'APA':
        return `${websiteData.author}. (${websiteData.date}). ${websiteData.title}. ${websiteData.url}.`;
      case 'Chicago':
        return `${websiteData.author}, "${websiteData.title}", accessed ${websiteData.date}, ${websiteData.url}.`;
      case 'IEEE':
        return `[1] ${websiteData.author}, "${websiteData.title}", ${websiteData.url}. (accessed ${websiteData.date})`;
      default:
        return '';
    }
  };

  const generateBookCitation = () => {
    switch (citationStyle) {
      case 'MLA':
        return `${bookData.author}. ${bookData.title}. ${bookData.publisher}, ${bookData.year}.`;
      case 'APA':
        return `${bookData.author}. (${bookData.year}). ${bookData.title}. ${bookData.publisher}.`;
      case 'Chicago':
        return `${bookData.author}, ${bookData.title} (${bookData.publisher}, ${bookData.year}).`;
      case 'IEEE':
        return `[1] ${bookData.author}, ${bookData.title}. ${bookData.publisher}, ${bookData.year}.`;
      default:
        return '';
    }
  };

  const generateJournalCitation = () => {
    switch (citationStyle) {
      case 'MLA':
        return `${journalData.author}. "${journalData.title}." ${journalData.journal} ${journalData.volume}.${journalData.issue} (${journalData.year}): ${journalData.pages}.`;
      case 'APA':
        return `${journalData.author}. (${journalData.year}). ${journalData.title}. ${journalData.journal}, ${journalData.volume}(${journalData.issue}), ${journalData.pages}.`;
      case 'Chicago':
        return `${journalData.author}, "${journalData.title}," ${journalData.journal} ${journalData.volume}, no. ${journalData.issue} (${journalData.year}): ${journalData.pages}.`;
      case 'IEEE':
        return `[1] ${journalData.author}, "${journalData.title}," ${journalData.journal}, vol. ${journalData.volume}, no. ${journalData.issue}, p. ${journalData.pages}, ${journalData.year}.`;
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            citationType === 'website' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationTypeChange('website')}
        >
          Website
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            citationType === 'book' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationTypeChange('book')}
        >
          Book
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            citationType === 'journal' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationTypeChange('journal')}
        >
          Journal
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            citationStyle === 'MLA' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationStyleChange('MLA')}
        >
          MLA
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            citationStyle === 'APA' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationStyleChange('APA')}
        >
          APA
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            citationStyle === 'Chicago' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationStyleChange('Chicago')}
        >
          Chicago
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            citationStyle === 'IEEE' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCitationStyleChange('IEEE')}
        >
          IEEE
        </button>
      </div>

      {citationType === 'website' && (
        <div>
          <label className="block mb-2">
            Title:
            <input
              type="text"
              value={websiteData.title}
              onChange={(e) => handleWebsiteDataChange('title', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            URL:
            <input
              type="text"
              value={websiteData.url}
              onChange={(e) => handleWebsiteDataChange('url', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Author:
            <input
              type="text"
              value={websiteData.author}
              onChange={(e) => handleWebsiteDataChange('author', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Date:
            <input
              type="text"
              value={websiteData.date}
              onChange={(e) => handleWebsiteDataChange('date', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
        </div>
      )}

      {citationType === 'book' && (
        <div>
          <label className="block mb-2">
            Title:
            <input
              type="text"
              value={bookData.title}
              onChange={(e) => handleBookDataChange('title', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Author:
            <input
              type="text"
              value={bookData.author}
              onChange={(e) => handleBookDataChange('author', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Publisher:
            <input
              type="text"
              value={bookData.publisher}
              onChange={(e) => handleBookDataChange('publisher', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Year:
            <input
              type="text"
              value={bookData.year}
              onChange={(e) => handleBookDataChange('year', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
        </div>
      )}

      {citationType === 'journal' && (
        <div>
          <label className="block mb-2">
            Title:
            <input
              type="text"
              value={journalData.title}
              onChange={(e) => handleJournalDataChange('title', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Author:
            <input
              type="text"
              value={journalData.author}
              onChange={(e) => handleJournalDataChange('author', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Journal:
            <input
              type="text"
              value={journalData.journal}
              onChange={(e) => handleJournalDataChange('journal', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Volume:
            <input
              type="text"
              value={journalData.volume}
              onChange={(e) => handleJournalDataChange('volume', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Issue:
            <input
              type="text"
              value={journalData.issue}
              onChange={(e) => handleJournalDataChange('issue', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Pages:
            <input
              type="text"
              value={journalData.pages}
              onChange={(e) => handleJournalDataChange('pages', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Year:
            <input
              type="text"
              value={journalData.year}
              onChange={(e) => handleJournalDataChange('year', e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </label>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-bold">Citation:</h3>
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{citation}</pre>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
          onClick={() => {
            navigator.clipboard.writeText(citation);
            setShowAlert(true);
          }}
        >
          Copy to Clipboard
        </button>
      </div>

      {showAlert && (
        <AlertDialog>
          <AlertDialogAction onClick={() => setShowAlert(false)}>
            <Alert>
              <AlertTitle>Citation Copied</AlertTitle>
              <AlertDescription>
                The citation has been copied to your clipboard.
              </AlertDescription>
            </Alert>
          </AlertDialogAction>
        </AlertDialog>
      )}
    </div>
  );
};

export default CitationGenerator;
