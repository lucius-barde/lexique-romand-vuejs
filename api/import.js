import { searchHsuter } from './lib/import_hsuter.js'
import { searchHsuternames } from './lib/import_hsuternames.js'
import { searchTopio } from './lib/import_topio.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Méthode non autorisée' })
  }

  const searchTerm = new URL(request.url, `http://${request.headers.host || 'localhost'}`).searchParams.get('searchTerm')?.trim()
  const source = new URL(request.url, `http://${request.headers.host || 'localhost'}`).searchParams.get('source')

  if (!searchTerm) return response.status(400).json({ error: 'Le terme de recherche est requis.' })

  const searchers = { hsuter: searchHsuter, hsuternames: searchHsuternames, topio: searchTopio }
  const searcher = searchers[source]
  if (!searcher) return response.status(400).json({ error: 'Source inconnue.' })

  try {
    const result = await searcher(searchTerm)
    return response.status(200).json({ status: 'success', result })
  } catch (error) {
    console.error(`Import ${source} failed:`, error)
    return response.status(502).json({ error: error.message || 'La recherche externe a échoué.' })
  }
}
