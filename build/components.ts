/* eslint-disable */
import nodeResolve from '@rollup/plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue' // 处理vue文件
import filesize from 'rollup-plugin-filesize'
import fs from 'fs'
import { sync as globSync } from 'fast-glob'
import path from 'path'
import { rollup } from 'rollup'

import { errorAndExit, yellow, green, getExternals } from './utils'
import { compRoot, buildOutput } from './paths'
import reporter from './size-reporter'
import esbuild from 'rollup-plugin-esbuild'

const outputDir = path.resolve(buildOutput, './components')

const plugins = [
  nodeResolve(),
  vue(),
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        declaration: false
      },
      exclude: ['node_modules', 'examples', 'tests']
    },
    abortOnError: false,
    clean: true
  }),
  esbuild(
    {
      pure: ['console.log', 'debugger'],
      minify: true
    }
  )
]

const dtsPlugins = [
  nodeResolve(),
  vue({
    target: 'browser',
    preprocessStyles: false,
    exposeFilename: false
  }),
  typescript({
    useTsconfigDeclarationDir: false,
    tsconfigOverride: {
      include: ['packages/components/**/*'],
      exclude: ['build', 'node_modules', 'examples', 'tests', 'packages']
    },
    abortOnError: false
  }),
  esbuild(
    {
      pure: ['console.log', 'debugger'],
      minify: true
    }
  ),
]

;(async () => {
  // 构建组件
  yellow('Start building component')
  await buildComponent()
  green('Component buld successfully')

  // 构建入口
  yellow('Start building entry file')
  await buildEntry()
  green('Entry built successfully')

  // 构建dts
  yellow('Start building dts file')
  await buildDTS()
  green('DTS built successfully')
})().catch((e: Error) => errorAndExit(e))

async function getComponents() {
  const files = globSync('*', { cwd: compRoot, onlyDirectories: true })
  return files.map((file) => ({
    path: path.resolve(compRoot, file),
    name: file,
  }))
}

// build component
async function buildComponent() {
  const componentPaths = await getComponents()
  
  const builds = componentPaths.map(
    async ({ path: p, name: componentName }) => {
      const entry = path.resolve(p, './index.ts')
      if(!fs.existsSync(entry)) return

      const rollupConfig = {
        input: entry,
        plugins,
        external: getExternals({ full: false })
      }

      const bundle = await rollup(rollupConfig)

      // ESM
      await bundle.write({
        format: 'es',
        file: `${outputDir}/${componentName}/index.js`,
        plugins: [
          filesize({
            reporter,
          }),
        ]
      })
    }
  )
  try {
    await Promise.all(builds)
  } catch (e: any) {
    errorAndExit(e)
  }
}

// build entry
async function buildEntry() {
  const entry = path.resolve(compRoot, './index.ts')
  const rollupConfig = {
    input: entry,
    plugins,
    external: getExternals({ full: false })
  }

  try {
    const bundle = await rollup(rollupConfig)
    // ESM
    await bundle.write({
      format: 'es',
      file: `${outputDir}/index.js`,
      plugins: [
        filesize({
          reporter,
        }),
      ],
    })
  } catch (e: any) {
    errorAndExit(e)
  }
}

// build DTS
async function buildDTS() {
  const entry = path.resolve(compRoot, './index.ts')
  const rollupConfig = {
    input: entry,
    plugins: dtsPlugins,
    external: getExternals({ full: false })
  }
  const bundle = await rollup(rollupConfig)
  // ESM
  await bundle.write({
    format: 'es',
    file: `${outputDir}/index.esm.js`,
    plugins: [
      filesize({
        reporter,
      }),
    ]
  })
}