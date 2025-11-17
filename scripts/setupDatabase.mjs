// scripts/setupDatabase.mjs
import pg from 'pg';
// Fix: Use `readline/promises` for async/await support, which provides better type inference.
import { createInterface } from 'node:readline/promises';
// Fix: Import `process` to provide type definitions for `process.stdin`, `process.stdout`, and `process.exit`.
import process from 'node:process';

const { Pool } = pg;

const hsk1Words = [
    { character: '爱', pinyin: 'ài', word_class: 'v.', translation: 'amar' },
    { character: '八', pinyin: 'bā', word_class: 'num.', translation: 'oito' },
    { character: '爸爸', pinyin: 'bàba', word_class: 'n.', translation: 'pai' },
    { character: '杯子', pinyin: 'bēizi', word_class: 'n.', translation: 'copo, xícara' },
    { character: '北京', pinyin: 'Běijīng', word_class: 'n.', translation: 'Pequim' },
    { character: '本', pinyin: 'běn', word_class: 'm.', translation: 'classificador para livros' },
    { character: '不客气', pinyin: 'bú kèqi', word_class: 'expr.', translation: 'de nada' },
    { character: '不', pinyin: 'bù', word_class: 'adv.', translation: 'não' },
    { character: '菜', pinyin: 'cài', word_class: 'n.', translation: 'prato (comida), vegetal' },
    { character: '茶', pinyin: 'chá', word_class: 'n.', translation: 'chá' },
    { character: '吃', pinyin: 'chī', word_class: 'v.', translation: 'comer' },
    { character: '出租车', pinyin: 'chūzūchē', word_class: 'n.', translation: 'táxi' },
    { character: '打电话', pinyin: 'dǎ diànhuà', word_class: 'v.', translation: 'telefonar' },
    { character: '大', pinyin: 'dà', word_class: 'adj.', translation: 'grande' },
    { character: '的', pinyin: 'de', word_class: 'part.', translation: 'partícula possessiva' },
    { character: '点', pinyin: 'diǎn', word_class: 'n.', translation: 'hora (ponto), um pouco' },
    { character: '电脑', pinyin: 'diànnǎo', word_class: 'n.', translation: 'computador' },
    { character: '电视', pinyin: 'diànshì', word_class: 'n.', translation: 'televisão' },
    { character: '电影', pinyin: 'diànyǐng', word_class: 'n.', translation: 'filme' },
    { character: '东西', pinyin: 'dōngxi', word_class: 'n.', translation: 'coisa' },
    { character: '都', pinyin: 'dōu', word_class: 'adv.', translation: 'todos, ambos' },
    { character: '读', pinyin: 'dú', word_class: 'v.', translation: 'ler' },
    { character: '对不起', pinyin: 'duìbuqǐ', word_class: 'expr.', translation: 'desculpe' },
    { character: '多', pinyin: 'duō', word_class: 'adj.', translation: 'muito, numeroso' },
    { character: '多少', pinyin: 'duōshao', word_class: 'pron.', translation: 'quanto(s)' },
    { character: '儿子', pinyin: 'érzi', word_class: 'n.', translation: 'filho' },
    { character: '二', pinyin: 'èr', word_class: 'num.', translation: 'dois' },
    { character: '饭店', pinyin: 'fàndiàn', word_class: 'n.', translation: 'restaurante, hotel' },
    { character: '飞机', pinyin: 'fēijī', word_class: 'n.', translation: 'avião' },
    { character: '分钟', pinyin: 'fēnzhōng', word_class: 'n.', translation: 'minuto' },
    { character: '高兴', pinyin: 'gāoxìng', word_class: 'adj.', translation: 'feliz, contente' },
    { character: '个', pinyin: 'gè', word_class: 'm.', translation: 'classificador geral' },
    { character: '工作', pinyin: 'gōngzuò', word_class: 'n./v.', translation: 'trabalho, trabalhar' },
    { character: '狗', pinyin: 'gǒu', word_class: 'n.', translation: 'cachorro' },
    { character: '汉语', pinyin: 'Hànyǔ', word_class: 'n.', translation: 'língua chinesa (Mandarim)' },
    { character: '好', pinyin: 'hǎo', word_class: 'adj.', translation: 'bom' },
    { character: '喝', pinyin: 'hē', word_class: 'v.', translation: 'beber' },
    { character: '和', pinyin: 'hé', word_class: 'conj.', translation: 'e' },
    { character: '很', pinyin: 'hěn', word_class: 'adv.', translation: 'muito' },
    { character: '后面', pinyin: 'hòumiàn', word_class: 'n.', translation: 'atrás' },
    { character: '回', pinyin: 'huí', word_class: 'v.', translation: 'voltar' },
    { character: '会', pinyin: 'huì', word_class: 'v. aux.', translation: 'saber (fazer algo), poder' },
    { character: '火车站', pinyin: 'huǒchēzhàn', word_class: 'n.', translation: 'estação de trem' },
    { character: '几', pinyin: 'jǐ', word_class: 'pron.', translation: 'quantos (para poucos)' },
    { character: '家', pinyin: 'jiā', word_class: 'n.', translation: 'casa, família' },
    { character: '叫', pinyin: 'jiào', word_class: 'v.', translation: 'chamar-se' },
    { character: '今天', pinyin: 'jīntiān', word_class: 'n.', translation: 'hoje' },
    { character: '九', pinyin: 'jiǔ', word_class: 'num.', translation: 'nove' },
    { character: '开', pinyin: 'kāi', word_class: 'v.', translation: 'abrir, dirigir' },
    { character: '看', pinyin: 'kàn', word_class: 'v.', translation: 'ver, olhar' },
    { character: '看见', pinyin: 'kànjiàn', word_class: 'v.', translation: 'ver (perceber com os olhos)' },
    { character: '块', pinyin: 'kuài', word_class: 'm.', translation: 'unidade de moeda (Yuan)' },
    { character: '来', pinyin: 'lái', word_class: 'v.', translation: 'vir' },
    { character: '老师', pinyin: 'lǎoshī', word_class: 'n.', translation: 'professor' },
    { character: '了', pinyin: 'le', word_class: 'part.', translation: 'partícula de ação completada' },
    { character: '冷', pinyin: 'lěng', word_class: 'adj.', translation: 'frio' },
    { character: '里', pinyin: 'lǐ', word_class: 'n.', translation: 'dentro' },
    { character: '六', pinyin: 'liù', word_class: 'num.', translation: 'seis' },
    { character: '妈妈', pinyin: 'māma', word_class: 'n.', translation: 'mãe' },
    { character: '吗', pinyin: 'ma', word_class: 'part.', translation: 'partícula interrogativa' },
    { character: '买', pinyin: 'mǎi', word_class: 'v.', translation: 'comprar' },
    { character: '猫', pinyin: 'māo', word_class: 'n.', translation: 'gato' },
    { character: '没关系', pinyin: 'méi guānxi', word_class: 'expr.', translation: 'não importa, tudo bem' },
    { character: '没有', pinyin: 'méiyǒu', word_class: 'v.', translation: 'não ter' },
    { character: '米饭', pinyin: 'mǐfàn', word_class: 'n.', translation: 'arroz cozido' },
    { character: '明天', pinyin: 'míngtiān', word_class: 'n.', translation: 'amanhã' },
    { character: '名字', pinyin: 'míngzi', word_class: 'n.', translation: 'nome' },
    { character: '哪', pinyin: 'nǎ', word_class: 'pron.', translation: 'qual' },
    { character: '那', pinyin: 'nà', word_class: 'pron.', translation: 'aquele, aquilo' },
    { character: '呢', pinyin: 'ne', word_class: 'part.', translation: 'partícula interrogativa (e você?)' },
    { character: '能', pinyin: 'néng', word_class: 'v. aux.', translation: 'poder, ser capaz de' },
    { character: '你', pinyin: 'nǐ', word_class: 'pron.', translation: 'você' },
    { character: '年', pinyin: 'nián', word_class: 'n.', translation: 'ano' },
    { character: '女儿', pinyin: 'nǚ\'ér', word_class: 'n.', translation: 'filha' },
    { character: '朋友', pinyin: 'péngyou', word_class: 'n.', translation: 'amigo' },
    { character: '漂亮', pinyin: 'piàoliang', word_class: 'adj.', translation: 'bonito(a)' },
    { character: '苹果', pinyin: 'píngguǒ', word_class: 'n.', translation: 'maçã' },
    { character: '七', pinyin: 'qī', word_class: 'num.', translation: 'sete' },
    { character: '钱', pinyin: 'qián', word_class: 'n.', translation: 'dinheiro' },
    { character: '前面', pinyin: 'qiánmiàn', word_class: 'n.', translation: 'frente' },
    { character: '请', pinyin: 'qǐng', word_class: 'v.', translation: 'por favor, convidar' },
    { character: '去', pinyin: 'qù', word_class: 'v.', translation: 'ir' },
    { character: '热', pinyin: 'rè', word_class: 'adj.', translation: 'quente' },
    { character: '人', pinyin: 'rén', word_class: 'n.', translation: 'pessoa' },
    { character: '认识', pinyin: 'rènshi', word_class: 'v.', translation: 'conhecer' },
    { character: '日', pinyin: 'rì', word_class: 'n.', translation: 'dia, sol' },
    { character: '三', pinyin: 'sān', word_class: 'num.', translation: 'três' },
    { character: '商店', pinyin: 'shāngdiàn', word_class: 'n.', translation: 'loja' },
    { character: '上', pinyin: 'shàng', word_class: 'n.', translation: 'em cima, ir para cima' },
    { character: '上午', pinyin: 'shàngwǔ', word_class: 'n.', translation: 'manhã' },
    { character: '少', pinyin: 'shǎo', word_class: 'adj.', translation: 'pouco' },
    { character: '谁', pinyin: 'shéi', word_class: 'pron.', translation: 'quem' },
    { character: '什么', pinyin: 'shénme', word_class: 'pron.', translation: 'o que' },
    { character: '十', pinyin: 'shí', word_class: 'num.', translation: 'dez' },
    { character: '时候', pinyin: 'shíhou', word_class: 'n.', translation: 'tempo, momento' },
    { character: '是', pinyin: 'shì', word_class: 'v.', translation: 'ser' },
    { character: '书', pinyin: 'shū', word_class: 'n.', translation: 'livro' },
    { character: '水', pinyin: 'shuǐ', word_class: 'n.', translation: 'água' },
    { character: '水果', pinyin: 'shuǐguǒ', word_class: 'n.', translation: 'fruta' },
    { character: '睡觉', pinyin: 'shuìjiào', word_class: 'v.', translation: 'dormir' },
    { character: '说', pinyin: 'shuō', word_class: 'v.', translation: 'falar' },
    { character: '四', pinyin: 'sì', word_class: 'num.', translation: 'quatro' },
    { character: '岁', pinyin: 'suì', word_class: 'm.', translation: 'ano (de idade)' },
    { character: '他', pinyin: 'tā', word_class: 'pron.', translation: 'ele' },
    { character: '她', pinyin: 'tā', word_class: 'pron.', translation: 'ela' },
    { character: '太', pinyin: 'tài', word_class: 'adv.', translation: 'demais, muito' },
    { character: '天气', pinyin: 'tiānqì', word_class: 'n.', translation: 'tempo (clima)' },
    { character: '听', pinyin: 'tīng', word_class: 'v.', translation: 'ouvir' },
    { character: '同学', pinyin: 'tóngxué', word_class: 'n.', translation: 'colega de classe' },
    { character: '喂', pinyin: 'wèi', word_class: 'interj.', translation: 'alô (ao telefone)' },
    { character: '我', pinyin: 'wǒ', word_class: 'pron.', translation: 'eu' },
    { character: '我们', pinyin: 'wǒmen', word_class: 'pron.', translation: 'nós' },
    { character: '五', pinyin: 'wǔ', word_class: 'num.', translation: 'cinco' },
    { character: '喜欢', pinyin: 'xǐhuan', word_class: 'v.', translation: 'gostar' },
    { character: '下', pinyin: 'xià', word_class: 'n.', translation: 'embaixo, descer' },
    { character: '下午', pinyin: 'xiàwǔ', word_class: 'n.', translation: 'tarde' },
    { character: '下雨', pinyin: 'xià yǔ', word_class: 'v.', translation: 'chover' },
    { character: '先生', pinyin: 'xiānsheng', word_class: 'n.', translation: 'senhor, marido' },
    { character: '现在', pinyin: 'xiànzài', word_class: 'n.', translation: 'agora' },
    { character: '想', pinyin: 'xiǎng', word_class: 'v.', translation: 'querer, pensar, sentir falta' },
    { character: '小', pinyin: 'xiǎo', word_class: 'adj.', translation: 'pequeno' },
    { character: '小姐', pinyin: 'xiǎojiě', word_class: 'n.', translation: 'senhorita' },
    { character: '些', pinyin: 'xiē', word_class: 'm.', translation: 'alguns, um pouco de' },
    { character: '写', pinyin: 'xiě', word_class: 'v.', translation: 'escrever' },
    { character: '谢谢', pinyin: 'xièxie', word_class: 'v.', translation: 'obrigado' },
    { character: '星期', pinyin: 'xīngqī', word_class: 'n.', translation: 'semana' },
    { character: '学生', pinyin: 'xuésheng', word_class: 'n.', translation: 'estudante' },
    { character: '学习', pinyin: 'xuéxí', word_class: 'v.', translation: 'estudar' },
    { character: '学校', pinyin: 'xuéxiào', word_class: 'n.', translation: 'escola' },
    { character: '一', pinyin: 'yī', word_class: 'num.', translation: 'um' },
    { character: '衣服', pinyin: 'yīfu', word_class: 'n.', translation: 'roupa' },
    { character: '医生', pinyin: 'yīshēng', word_class: 'n.', translation: 'médico' },
    { character: '医院', pinyin: 'yīyuàn', word_class: 'n.', translation: 'hospital' },
    { character: '椅子', pinyin: 'yǐzi', word_class: 'n.', translation: 'cadeira' },
    { character: '有', pinyin: 'yǒu', word_class: 'v.', translation: 'ter' },
    { character: '月', pinyin: 'yuè', word_class: 'n.', translation: 'mês, lua' },
    { character: '再见', pinyin: 'zàijiàn', word_class: 'expr.', translation: 'adeus' },
    { character: '在', pinyin: 'zài', word_class: 'v.', translation: 'estar em' },
    { character: '怎么', pinyin: 'zěnme', word_class: 'pron.', translation: 'como' },
    { character: '怎么样', pinyin: 'zěnmeyàng', word_class: 'pron.', translation: 'que tal' },
    { character: '这', pinyin: 'zhè', word_class: 'pron.', translation: 'este, isto' },
    { character: '中国', pinyin: 'Zhōngguó', word_class: 'n.', translation: 'China' },
    { character: '中午', pinyin: 'zhōngwǔ', word_class: 'n.', translation: 'meio-dia' },
    { character: '住', pinyin: 'zhù', word_class: 'v.', translation: 'morar' },
    { character: '桌子', pinyin: 'zhuōzi', word_class: 'n.', translation: 'mesa' },
    { character: '字', pinyin: 'zì', word_class: 'n.', translation: 'caractere' },
    { character: '昨天', pinyin: 'zuótiān', word_class: 'n.', translation: 'ontem' },
    { character: '坐', pinyin: 'zuò', word_class: 'v.', translation: 'sentar' },
    { character: '做', pinyin: 'zuò', word_class: 'v.', translation: 'fazer' },
];

/**
 * Pede ao usuário a connection string se não estiver disponível em process.env.
 * @returns {Promise<string>} A connection string do banco de dados.
 */
// Fix: Refactored to use async/await and readline/promises for cleaner code and better type inference.
async function getConnectionString() {
    if (process.env.POSTGRES_URL) {
        return process.env.POSTGRES_URL;
    }

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await rl.question('❓ Por favor, cole a sua "Connection String" do Supabase PostgreSQL e pressione Enter:\n💡 DICA: Se sua senha contiver caracteres especiais (como @, :, /), eles precisam ser codificados. Exemplo: @ vira %40\n> ');
    
    rl.close();

    if (!answer) {
        console.error('❌ Nenhuma connection string fornecida. Abortando.');
        process.exit(1);
    }
    return answer;
}


async function initializeDatabase() {
    console.log('Iniciando o setup do banco de dados...');
    
    const connectionString = await getConnectionString();
    
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const res = await pool.query("SELECT to_regclass('public.hsk1_vocabulary')");
        if (res.rows[0].to_regclass) {
            console.log('👍 Tabela "hsk1_vocabulary" já existe. Setup ignorado.');
            return;
        }

        console.log('Criando a tabela "hsk1_vocabulary"...');
        await pool.query(`
            CREATE TABLE hsk1_vocabulary (
                id SERIAL PRIMARY KEY,
                character VARCHAR(255) NOT NULL,
                pinyin VARCHAR(255) NOT NULL,
                word_class VARCHAR(50),
                translation TEXT NOT NULL
            );
        `);
        console.log('Tabela criada com sucesso.');

        console.log(`Inserindo ${hsk1Words.length} palavras...`);
        for (const word of hsk1Words) {
            await pool.query(
                'INSERT INTO hsk1_vocabulary (character, pinyin, word_class, translation) VALUES ($1, $2, $3, $4)',
                [word.character, word.pinyin, word.word_class, word.translation]
            );
        }
        console.log('✅ Setup do banco de dados concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante a inicialização do banco de dados:', error);
        throw error;
    } finally {
        // Encerra a conexão pool para que o script termine.
        await pool.end();
        console.log('Conexão com o banco de dados encerrada.');
    }
}

initializeDatabase();
