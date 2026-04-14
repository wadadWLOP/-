import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function injectSixFacesCredentials(secretId: string, secretKey: string) {
  const htmlPath = path.resolve(__dirname, 'public/six-faces/index.html')
  if (!fs.existsSync(htmlPath)) {
    return
  }
  
  let html = fs.readFileSync(htmlPath, 'utf-8')
  html = html.replace(
    /window\.VITE_TENCENT_SECRET_ID\s*=\s*['"][^'"]*['"]/,
    `window.VITE_TENCENT_SECRET_ID = '${secretId}'`
  )
  html = html.replace(
    /window\.VITE_TENCENT_SECRET_KEY\s*=\s*['"][^'"]*['"]/,
    `window.VITE_TENCENT_SECRET_KEY = '${secretKey}'`
  )
  fs.writeFileSync(htmlPath, html)
  console.log('✅ Injected Tencent Cloud credentials into Six Faces')
}

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 获取腾讯云密钥
  const secretId = env.VITE_TENCENT_SECRET_ID || env.TENCENT_SECRET_ID || ''
  const secretKey = env.VITE_TENCENT_SECRET_KEY || env.TENCENT_SECRET_KEY || ''
  
  return {
    plugins: [
      react(),
      {
        name: 'inject-six-faces-env',
        apply: 'build',  // 仅在构建时应用
        closeBundle() {
          injectSixFacesCredentials(secretId, secretKey)
        }
      },
      {
        name: 'inject-six-faces-env-dev',
        apply: 'serve',  // 仅在开发时应用
        configureServer(server) {
          // 在服务器启动前注入密钥
          setTimeout(() => {
            injectSixFacesCredentials(secretId, secretKey)
          }, 100)
        }
      }
    ],
  }
})
