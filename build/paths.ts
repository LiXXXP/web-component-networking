import path from 'path'

export const projRoot = path.resolve(__dirname, '../')
export const pkgRoot = path.resolve(projRoot, './packages')
export const compRoot = path.resolve(pkgRoot, './components')
export const themeRoot = path.resolve(pkgRoot, './theme-default')
export const buildOutput = path.resolve(projRoot, './lib')
