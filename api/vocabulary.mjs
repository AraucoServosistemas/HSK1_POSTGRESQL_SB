// api/vocabulary.mjs
import { pool } from '../dbConfig.mjs';

export default async function handler(request, response) {
  try {
    const { rows } = await pool.query('SELECT * FROM hsk1_vocabulary ORDER BY id');
    
    // Define cabeçalhos de cache para otimizar a entrega e reduzir hits no banco.
    // Cache de 1 hora no CDN da Vercel, e revalidação a cada 5 minutos.
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
    
    return response.status(200).json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    // Para depuração, retornamos uma mensagem de erro mais específica.
    const errorMessage = error instanceof Error ? error.message : 'An unknown database error occurred.';
    return response.status(500).json({ error: `Failed to fetch vocabulary from the database: ${errorMessage}` });
  }
}
