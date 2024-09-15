import OpenAI from 'openai';

import { Injectable } from '@nestjs/common';
import Together from 'together-ai';
@Injectable()
export class AIService {
  constructor() {}

  async ask(text: string): Promise<string> {
    try {
      const together = new Together({
        apiKey: process.env['MISTRAL_API_KEY'], // This is the default and can be omitted
      });

      const response = await together.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Please consider i'm non-native englisher speaker in beginner level and explain clear and short way,I'm providing a sentense of The Haunting of Hill House First Season please tell me , What is the meaning of ${text}`,
          },
        ],
        model: 'meta-llama/Llama-3-8b-chat-hf',
      });
      return response.choices[0].message.content;
      // const baseUrl = 'https://api.avalai.ir/v1';

      // const openai = new OpenAI({
      //   apiKey: process.env.AVALAI_API_KEY,
      //   baseURL: baseUrl,
      // });

      // const completion = await openai.chat.completions.create({
      //   messages: [
      //     {
      //       role: 'user',
      //       content: `Please consider that I am a non-native English speaker at a beginner level. Explain clearly with examples, and if you use some English words that are beyond my level, please explain them too,I'm providing a sentense of The Haunting of Hill House First Season please tell me , What is the meaning of ${text}`,
      //     },
      //   ],
      //   model: 'gpt-3.5-turbo',
      // });

      // return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }
}

// @Injectable()
// export class AIService {
//   private MistralClient: any;

//   constructor() {}

//   async ask(text: string): Promise<string> {
//     try {
//       if (!this.MistralClient) {
//         const { default: MistralClient } = await import('@mistralai/mistralai');
//         this.MistralClient = MistralClient;
//       }

//       const apiKey = process.env.MISTRAL_API_KEY;
//       const client = new this.MistralClient(apiKey);

//       const chatResponse = await client.chat({
//         model: 'mistral-large-latest',
//         messages: [{ role: 'user', content: text }],
//       });

//       return chatResponse.choices[0].message.content;
//     } catch (error) {
//       throw error;
//     }
//   }
// }
