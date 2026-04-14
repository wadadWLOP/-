import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function loadCredentials(): { secretId: string; secretKey: string } {
  const envSecretId = process.env.VITE_TENCENT_SECRET_ID || process.env.TENCENT_SECRET_ID
  const envSecretKey = process.env.VITE_TENCENT_SECRET_KEY || process.env.TENCENT_SECRET_KEY

  if (envSecretId && envSecretKey) {
    return { secretId: envSecretId, secretKey: envSecretKey }
  }

  const envPath = path.resolve(__dirname, '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    const secretIdMatch = content.match(/VITE_TENCENT_SECRET_ID=(.+)/)
    const secretKeyMatch = content.match(/VITE_TENCENT_SECRET_KEY=(.+)/)
    return {
      secretId: secretIdMatch ? secretIdMatch[1].trim() : '',
      secretKey: secretKeyMatch ? secretKeyMatch[1].trim() : ''
    }
  }

  return { secretId: '', secretKey: '' }
}

function injectCredentials(html: string, secretId: string, secretKey: string): string {
  if (!secretId || !secretKey) {
    console.warn('⚠️ Tencent Cloud credentials not found, skipping injection')
    return html
  }
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

export default defineConfig(() => {
  const { secretId, secretKey } = loadCredentials()

  console.log('🔧 Build credentials:', {
    secretId: secretId ? `${secretId.substring(0, 8)}...` : 'EMPTY',
    secretKey: secretKey ? `${secretKey.substring(0, 8)}...` : 'EMPTY'
  })

  return {
    plugins: [
      react(),
      {
        name: 'six-faces-credentials',
        apply: 'serve',
        configureServer(server) {
          const { secretId, secretKey } = loadCredentials()
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
          const { secretId, secretKey } = loadCredentials()
          const htmlPath = path.resolve(__dirname, 'public/six-faces/index.html')
          if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8')
            html = injectCredentials(html, secretId, secretKey)
            fs.writeFileSync(htmlPath, html)
            if (secretId && secretKey) {
              console.log('✅ Injected Tencent Cloud credentials into Six Faces')
            }
          }
        }
      }
    ],
  }
})