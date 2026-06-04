import getKey from './get_key.js'
function getCleanup(battle = {}, battles = [], index){
  let tempBattle = JSON.parse(JSON.stringify(battle))
  for(let i in battles){
    if(i < index){
      for(let u in battles[i].defenderUnit){
        if(battles[i].defenderUnit[u].healthPercent < 100 || battles[i].defenderUnit[u].shieldPercent < 100) tempBattle.cleanUp = true
        if(battles[i].defenderUnit[u].healthPercent === 0){
          tempBattle.defenderUnit = tempBattle.defenderUnit.filter(x=>x.definitionId !== battles[i].defenderUnit[u].definitionId)
        }
      }
    }
  }
  return tempBattle
}
function getBattle(battle = {}, battles = []){
  let leader = battle.defenderUnit.find(x=>x.squadUnitType === 3 || x.squadUnitType === 2)
  if(leader?.definitionId){
    let tempArray = battles.filter(x=>x.defenderUnit.filter(y=>y.definitionId === leader.definitionId).length > 0)
    if(tempArray?.length > 0){
      let index = tempArray.findIndex(x=>x.startTime === battle.startTime)
      if(index === 0){
        return JSON.parse(JSON.stringify(battle))
      }else{
        return getCleanup(battle, tempArray, index)
      }
    }
  }
}
function updateBattle(battle = {}, battles = [], { season, league, mode }){
  let res = getBattle(battle, battles)
  res.season = season
  res.league = league
  res.mode = mode
  res.win = 0,
  res.loss = 0,
  res.total = 0
  res.defendUnitCount = +res.defenderUnit?.length || 0
  res.attackUnitCount = +res.attackerUnit?.length || 0
  return getKey(res)
}

export default function(battles = [], history = {}){
  let res = { defenseResult: [] }
  for(let i in battles){
    let result = updateBattle(battles[i], battles, history)
    if(result?.key) res.defenseResult.push(result)
  }
  return res
}
