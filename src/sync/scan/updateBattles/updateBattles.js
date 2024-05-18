'uses strict'
const updateBattle = require('./updateBattle')
module.exports = (battles = [], history = {})=>{
  let res = { defenseResult: [] }
  for(let i in battles){
    let result = updateBattle(battles[i], battles, history)
    if(result.key) res.defenseResult.push(result)
  }
  return res
}
