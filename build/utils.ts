import chalk from 'chalk'
import path from 'path'
import { projRoot } from './paths'

export const getDeps = (pkgPath: string): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgJson = require(pkgPath)

  const { dependencies } = pkgJson
  return Object.keys(dependencies)
}

export const getExternals = (options: { full: boolean }) => (id: string) => {
  const packages: string[] = ['vue']
  if (!options.full) {
    const pkg = path.resolve(projRoot, './package.json')
    const depPackages = getDeps(pkg)
    packages.push('@vue', ...depPackages)
  }

  return [...new Set(packages)].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
}

export function yellow(str: string) {
  console.log(chalk.cyan(str))
}

export function green(str: string) {
  console.log(chalk.green(str))
}

export function red(str: string) {
  console.error(chalk.red(str))
}

export function errorAndExit(e: Error) {
  red(e.message)
  process.exit(1)
}
