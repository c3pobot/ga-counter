import { gaCache } from '../cache.js'

const indexSet = new Set()

export default async function( collection ){
  if(indexSet.has(collection)) return true
  let status = await gaCache.updateIndex( collection, { TTL: 1 }, { name: '_TTL', expireAfterSeconds: 150 * 24 * 3600 })
  if(!status) return
  status = await gaCache.updateIndex( collection, { _id: 1, total: 1, attackGl: 1 }, { name: '_id_total_attackGl' })
  indexSet.add(collection)
  return indexSet.has(collection)
}
