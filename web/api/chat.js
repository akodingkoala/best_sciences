// Vercel serverless function: POST /api/chat
// Set ANTHROPIC_API_KEY in the Vercel project's Environment Variables.
import { handleChatRequest } from '../server/chat.js'

export default function handler(req, res) {
  return handleChatRequest(req, res)
}
