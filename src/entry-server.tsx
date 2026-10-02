import { renderToString } from 'react-dom/server'
import App from './App'

/** Usado apenas no build (scripts/prerender.mjs) para gerar o HTML estático. */
export const render = (): string => renderToString(<App />)
