import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "davinci",
      prompt: `${prompt}`,
      temperature: 0.0,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).send('Too Many Requests. Please try again later.');
    } else {
      console.error(error);
      res.status(500).send(error || 'Something went wrong');
    }
  }
})
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))