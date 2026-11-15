import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In `npm run dev`, serve /api/chat locally with the same code the hosted function uses.
// Put ANTHROPIC_API_KEY=... in web/.env (gitignored).
function chatApi(env) {
  return {
    name: 'chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const { handleChatRequest } = await server.ssrLoadModule('/server/chat.js')
        handleChatRequest(req, res, env.ANTHROPIC_API_KEY)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), chatApi(env)],
  }
})
