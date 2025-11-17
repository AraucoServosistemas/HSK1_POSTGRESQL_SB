import React from 'react';
import type { VocabularyWord } from '../types';

interface VocabularyCardProps {
  word: VocabularyWord;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word }) => {
  const handleSpeak = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Desculpe, seu navegador não suporta a funcionalidade de fala.');
      return;
    }
    // Cancela qualquer fala anterior para evitar sobreposição
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Tenta encontrar uma voz nativa de mandarim
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice => voice.lang === 'zh-CN' || voice.lang === 'zh-TW');

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    } else {
      // Fallback para navegadores que podem não ter uma voz específica mas suportam o código de idioma
      utterance.lang = 'zh-CN';
    }

    utterance.rate = 0.8; // Um pouco mais lento para clareza
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:border-sky-500 dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-6xl font-han font-bold text-slate-800 dark:text-white leading-tight">{word.character}</h2>
        <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full px-2.5 py-1 transition-colors group-hover:bg-sky-100 dark:group-hover:bg-sky-900 group-hover:text-sky-600 dark:group-hover:text-sky-300">{word.id}</span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg text-slate-500 dark:text-slate-400">{word.pinyin}</p>
        <button
          onClick={() => handleSpeak(word.character)}
          className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          aria-label="Ouvir pronúncia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.969 9.969 0 0117 10c0 2.21-.894 4.208-2.343 5.657a1 1 0 01-1.414-1.414A7.969 7.969 0 0015 10c0-1.772-.57-3.39-1.515-4.671a1 1 0 010-1.414z" clipRule="evenodd" />
            <path d="M11.5 6.121a1 1 0 011.414 0 5.969 5.969 0 011.768 4.243 5.969 5.969 0 01-1.768 4.243 1 1 0 01-1.414-1.414 3.969 3.969 0 00-1.179-2.829 3.969 3.969 0 001.179-2.829 1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
      
      <div className="mb-5">
        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{word.word_class}</span>
      </div>

      <div className="border-t border-slate-200/80 dark:border-slate-700/60 pt-4 mt-auto flex-grow">
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{word.translation}</p>
      </div>
    </div>
  );
};

export default VocabularyCard;
