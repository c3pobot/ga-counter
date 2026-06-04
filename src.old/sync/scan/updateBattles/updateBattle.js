'use strict'
const getBattle = require('./getBattle')
const getKey = require('./getKey')

module.exports = (battle = {}, battles = [], { season, league, mode })=>{
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
