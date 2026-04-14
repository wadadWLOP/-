import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function injectCredentials(html: string, secretId: string, secretKey: string): string {
  return html
    .replace(
      /window\.VITE_TENCENT_SECRET_ID\s*=\s*['"][^'"]*['"]/,
      `window.VITE_TENCENT_SECRET_ID = '${secretId}'`
    )
    .replace(
      /window\.VITE_TENCENT_SECRET_KEY\s*=\s*['"][^'"]*['"]/,
      `window.VITE_TENCENT_SECRET_KEY = '${secretKey}'`
    )
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const secretId = env.VITE_TENCENT_SECRET_ID || env.TENCENT_SECRET_ID || ''
  const secretKey = env.VITE_TENCENT_SECRET_KEY || env.TENCENT_SECRET_KEY || ''

  return {
    plugins: [
      react(),
      {
        name: 'six-faces-credentials',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use('/six-faces/index.html', (req, res, next) => {
            const filePath = path.resolve(__dirname, 'public/six-faces/index.html')
            if (fs.existsSync(filePath)) {
              let html = fs.readFileSync(filePath, 'utf-8')
              html = injectCredentials(html, secretId, secretKey)
              res.setHeader('Content-Type', 'text/html')
              res.end(html)
            } else {
              next()
            }
          })
        }
      },
      {
        name: 'six-faces-credentials-build',
        apply: 'build',
        closeBundle() {
          const htmlPath = path.resolve(__dirname, 'public/six-faces/index.html')
          if (fs.existsSync(htmlPath) && secretId && secretKey) {
            let html = fs.readFileSync(htmlPath, 'utf-8')
            html = injectCredentials(html, secretId, secretKey)
            fs.writeFileSync(htmlPath, html)
            console.log('✅ Injected Tencent Cloud credentials into Six Faces')
          }
        }
      }
    ],
  }
})