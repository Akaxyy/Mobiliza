const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const ngrok = require('ngrok');

const app = express();
const port = 3000;

const url = 'http://www.cptm.sp.gov.br/Pages/Home.aspx';

async function getDataFromCptm() {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const getTextFromLine = (selector) => {
      const el = $(`${selector} span`).get(1);
      return el ? $(el).text().trim() : 'Informação não encontrada';
    };

    return {
      rubi: getTextFromLine('.rubi'),
      diamante: getTextFromLine('.diamante'),
      esmeralda: getTextFromLine('.esmeralda'),
      turquesa: getTextFromLine('.turquesa'),
      coral: getTextFromLine('.coral'),
      safira: getTextFromLine('.safira'),
    };
  } catch (error) {
    console.error('Erro ao obter dados da CPTM:', error.message);
    return { error: 'Erro ao buscar dados da CPTM' };
  }
}

app.get('/', async (req, res) => {
    const data = await getDataFromCptm();
    res.json(data);
});

app.listen(port, async () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);

    // try {
    //     const url = await ngrok.connect(port);
    //     console.log(`Ngrok disponivel em: ${url}`);
    // } catch (err) {
    //     console.log('Erro ao iniciar ngrok:', err);
    // }
});