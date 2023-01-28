import { ConfigEnv, loadEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock/dist'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const port = 4000
  return {
    plugins: [
      vue(),
      viteMockServe({
        supportTs: true,
        mockPath: 'examples/mock',
        watchFiles: true, // 监视文件夹中的文件更改。 并实时同步到请求结果
        localEnabled: command === 'serve', // 设置为 false 将禁用 mock 功能
        prodEnabled: false // 设置打包是否启用 mock 功能
      })
    ],
    server: {
      host: 'localhost',
      port: port,
      strictPort: false,
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: `http://127.0.0.1:${port}/mock`,
          changeOrigin: true,
          rewrite: (path) => path.replace('^' + env.VUE_APP_BASE_API, '')
        },
        '/gwtm': {
          target: 'http://117.50.92.210:9117',
          changeOrigin: true
        },
        '/api/': {
          target: 'http://test-api.cdgwin.com',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './examples'),
        '~': resolve(__dirname, './packages')
      }
    }
  }
}
