'use strict'
const log = require('logger')
const fetch = require('node-fetch')
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if (res?.status?.toString().startsWith('5')) {
      throw('Bad status code '+res.status)
    }
    return await res.json()
  }catch(e){
    throw(e);
  }
}
module.exports = async(uri, opts = {})=>{
  try{
    let res = await fetch(uri, opts)
    return await parseResponse(res)
  }catch(e){
    //if(e?.name) return { error: e.name, message: e.message }
    //if(e?.status) return await parseResponse(e)
    log.error(e)
  }
}
