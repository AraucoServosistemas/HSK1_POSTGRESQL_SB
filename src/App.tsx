import React, { useState, useMemo, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VocabularyCard from './components/VocabularyCard';
import ThemeSwitcher from './components/ThemeSwitcher';
import type { VocabularyWord } from './types';
import { fetchVocabularyFromAPI } from './api';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocabulary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchVocabularyFromAPI();
        setAllWords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVocabulary();
  }, []);

  const filteredWords = useMemo(() => {
    if (!searchTerm) {
      return allWords;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return allWords.filter((word) =>
      word.character.toLowerCase().includes(lowercasedFilter) ||
      word.pinyin.toLowerCase().includes(lowercasedFilter) ||
      word.translation.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, allWords]);

  const handleExportCSV = () => {
    if (filteredWords.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }

    const headers = ['ID', 'Character', 'Pinyin', 'Word Class', 'Translation'];
    const dataKeys: (keyof VocabularyWord)[] = ['id', 'character', 'pinyin', 'word_class', 'translation'];

    const escapeCSV = (field: any): string => {
      const str = String(field).replace(/"/g, '""');
      if (str.search(/("|,|\n)/g) >= 0) {
        return `"${str}"`;
      }
      return str;
    };

    const csvRows = filteredWords.map(word =>
      dataKeys.map(key => escapeCSV(word[key])).join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'HSK1_Vocabulary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-slate-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Loading vocabulary...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-16 text-xl text-red-500 bg-red-50 dark:bg-red-900/20 p-8 rounded-lg"><strong>Error:</strong> {error}</div>;
    }

    if (filteredWords.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.map((word: VocabularyWord) => (
            <VocabularyCard key={word.id} word={word} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <p className="text-xl font-medium text-slate-700 dark:text-slate-200">No vocabulary found for "{searchTerm}".</p>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search term.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <ThemeSwitcher />
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          <span className="text-sky-500">HSK 1</span> Vocabulary
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Browse, search, and master the essential words for the HSK Level 1 exam.
        </p>
      </header>

      <main>
        <div className="sticky top-4 z-10 py-4 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
            <div className="flex justify-center items-center gap-4 max-w-3xl mx-auto">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <button
                onClick={handleExportCSV}
                className="flex-shrink-0 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 font-medium p-3 rounded-lg transition-colors duration-200 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500"
                aria-label="Export filtered data to CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>

      </main>

      <footer className="text-center mt-16 py-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          HSK1 Vocabulary Viewer | Happy Studying!
        </p>
      </footer>
    </div>
  );
};

export default App;