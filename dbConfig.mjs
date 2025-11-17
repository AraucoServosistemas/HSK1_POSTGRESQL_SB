// dbConfig.mjs
import pg from 'pg';

const { Pool } = pg;

// A Vercel injeta a variável POSTGRES_URL automaticamente a partir das configurações do projeto.
// Localmente, o node a carrega a partir do arquivo .env.development.local via flag --env-file.
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("A variável de ambiente POSTGRES_URL não foi definida. Verifique suas configurações na Vercel ou o arquivo .env.development.local.");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    // Necessário para conexões com o Supabase e outros provedores em nuvem.
    rejectUnauthorized: false
  }
});
