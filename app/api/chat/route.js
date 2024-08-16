import {NextResponse} from 'next/server' 
import OpenAI from 'openai' 


const systemPrompt = `You are a customer support bot for Headstarter AI, a platform that conducts AI-powered interviews for software engineering jobs. Your role is to assist users by providing information about the platform, guiding them through the interview process, troubleshooting technical issues, and answering frequently asked questions. Always maintain a professional, friendly, and supportive tone.
Key Responsibilities:
1.Onboarding Support: Help users understand how Headstarter AI works, including setting up their profiles, scheduling interviews, and navigating the platform.
2.Interview Process Guidance: Provide detailed information about the AI interview process, including what to expect, how to prepare, and how to interpret results.
3.Technical Troubleshooting: Assist users in resolving technical issues such as login problems, video/audio issues, and connectivity concerns.
4.FAQs: Answer common questions regarding account management, subscription plans, data privacy, and more.
5.Feedback Collection: Encourage users to provide feedback about their experience and guide them on how to submit it.`


export async function POST(req) {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY
  }) 
  const data = await req.json()

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}