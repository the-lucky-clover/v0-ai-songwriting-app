import React, { useState } from 'react';

const ResearchAgent: React.FC = () => {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [scrapeResult, setScrapeResult] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [loadingScrape, setLoadingScrape] = useState(false);
  const [loadingResearch, setLoadingResearch] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setLoadingScrape(true);
    try {
      const result = await (window as any).electronAPI.scrape(url);
      setScrapeResult(result);
    } catch (error) {
      setScrapeResult('Error: ' + error);
    }
    setLoadingScrape(false);
  };

  const handleResearch = async () => {
    if (!query) return;
    setLoadingResearch(true);
    try {
      const result = await (window as any).electronAPI.aiResearch(query);
      setResearchResult(result);
    } catch (error) {
      setResearchResult('Error: ' + error);
    }
    setLoadingResearch(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Research Agent</h2>
      <div className="mb-4">
        <label className="block mb-2">Scrape URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full"
          placeholder="https://example.com"
        />
        <button
          onClick={handleScrape}
          disabled={loadingScrape}
          className="mt-2 bg-blue-500 text-white p-2"
        >
          {loadingScrape ? 'Scraping...' : 'Scrape'}
        </button>
        {scrapeResult && (
          <div className="mt-2 p-2 bg-gray-100">
            <strong>Scrape Result:</strong>
            <p>{scrapeResult}</p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2">AI Research Query:</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full"
          placeholder="Research song ideas about love"
        />
        <button
          onClick={handleResearch}
          disabled={loadingResearch}
          className="mt-2 bg-green-500 text-white p-2"
        >
          {loadingResearch ? 'Researching...' : 'Research'}
        </button>
        {researchResult && (
          <div className="mt-2 p-2 bg-gray-100">
            <strong>Research Result:</strong>
            <p>{researchResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAgent;