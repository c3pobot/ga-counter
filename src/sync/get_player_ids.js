import log from '../logger.js'
import { gaCache } from '../cache.js'

export default async function(groupId){
  let playerList = await gaCache.get('playerList', { _id: groupId }, { _id: 0, playerIds: 1, historyIds: 1, counterIds: 1, groupId: 1 })
  if(!playerList?.historyIds || playerList?.historyIds?.length == 0) return


  let counterIds = new Set(playerList.counterIds || [])
  if(counterIds.size > 0 && counterIds.size !== playerList.counterIds.length) await gaCache.set('playerList', { _id: groupId }, { counterIds: [...counterIds.values()] })
  let playerIds = playerList?.historyIds.filter(x=>!counterIds.has(x))
  if(playerIds?.length > 2000) playerIds = playerIds.slice(0, 2000)
  return playerIds
}
