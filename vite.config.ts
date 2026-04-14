import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 加载当前模式的环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      {
        name: 'inject-six-faces-env',
        closeBundle() {
          const htmlPath = path.resolve(__dirname, 'public/six-faces/index.html')
          
          if (!fs.existsSync(htmlPath)) {
            return
          }
          
          // 从环境变量或 .env 获取密钥
          const secretId = env.VITE_TENCENT_SECRET_ID || env.TENCENT_SECRET_ID || ''
          const secretKey = env.VITE_TENCENT_SECRET_KEY || env.TENCENT_SECRET_KEY || ''
          
          let html = fs.readFileSync(htmlPath, 'utf-8')
          
          // 替换占位符
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
      }
    ],
  }
})
