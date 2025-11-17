import type { VocabularyWord } from './types';
import { hsk1Words } from './vocabulary.data';

// A Vercel irá rotear requisições de /api/* para as funções serverless na pasta /api.
const API_URL = '/api/vocabulary';

/**
 * Em ambiente de desenvolvimento, simulamos o ID que o banco de dados geraria.
 */
const vocabularyWithIds: VocabularyWord[] = hsk1Words.map((word, index) => ({
  ...word,
  id: index + 1,
}));


/**
 * Busca a lista de vocabulário. Em desenvolvimento, usa dados locais. Em produção, busca da API.
 */
export const fetchVocabularyFromAPI = async (): Promise<VocabularyWord[]> => {
  // O Vite injeta a variável `import.meta.env.DEV` que nos permite diferenciar os ambientes.
  if (import.meta.env.DEV) {
    console.log("Modo de desenvolvimento: Servindo dados de vocabulário estáticos.");
    // Simula o tempo de resposta da rede para que a tela de loading apareça brevemente.
    return new Promise(resolve => setTimeout(() => resolve(vocabularyWithIds), 500));
  }

  // A lógica de produção foi melhorada para fornecer mais detalhes em caso de erro.
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      // Se a resposta não for OK, tentamos obter o máximo de detalhes possível.
      const errorText = await response.text();
      try {
        // Primeiro, tentamos interpretar a resposta como JSON.
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      } catch (jsonError) {
        // Se não for JSON, provavelmente é um erro de servidor (ex: uma página de erro da Vercel).
        // Lançamos os primeiros 200 caracteres da resposta para ajudar na depuração.
        throw new Error(`Server error (${response.status}): ${errorText.substring(0, 200)}...`);
      }
    }

    const data: VocabularyWord[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch vocabulary:", error);
    if (error instanceof Error) {
        // O prefixo "Could not load vocabulary:" é adicionado para clareza na UI.
        throw new Error(`Could not load vocabulary: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while trying to fetch data.');
  }
};
