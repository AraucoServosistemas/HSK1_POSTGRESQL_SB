import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica primeiro o tema no localStorage e, em seguida, a preferência do sistema.
    // Esta lógica é executada apenas uma vez na montagem do componente.
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Padrão para ambientes não-navegador
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Adiciona ou remove a classe 'dark' com base no estado do tema
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Salva o tema atual no localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Falha ao salvar o tema no localStorage", error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return [theme, toggleTheme];
};
