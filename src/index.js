import log from './logger.js'
import cache from './cache.js'
import sync from './sync/index.js'
import gameData from './game_data.js'

function checkCache(){
  try{
    let status = cache.status()
    if(status){
      log.info(`cache is ready...`)
      return checkGameData()
    }
    setTimeout(checkCache, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkCache, 5000)
  }
}
function checkGameData(){
  try{
    let status = gameData.status()
    if(status){
      log.info(`game data is ready...`)
      return sync.start()
    }
    setTimeout(checkCache, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkCache, 5000)
  }
}
checkCache()
