import { mapDefault } from './map.constants'

const mapInstance = {
  map: '',
  defaultLayers: '',
  behaviour: '',
  groups: '',
}

function initMapPlatform(config){
  return new window.H.service.Platform(config)
}

function prepareMapObject(config){
  const {
    appId,
    appCode,
    useCIT,
    useHTTPS,
    elementName
  } = config
  return {
    appId: appId,
    appCode: appCode,
    useCit: useCIT ? useCIT : mapDefault.useCIT,
    useHTTPS: useHTTPS ? useHTTPS : mapDefault.useHTTPS,
    pixelRatio: window.devicePixelRatio || mapDefault.pixelRatio,
    elementName: elementName ? elementName : mapDefault.elementName
  }
}

function createMapInterface(){
  window.H.ui.UI.createDefault(mapInstance.map, mapInstance.defaultLayers)
}

function createMap(config){
    const mapObj = prepareMapObject(config)
    const {
      appId,
      appCode,
      useCIT,
      useHTTPS,
      pixelRatio,
      elementName
    } = mapObj
    const mapElement = document.getElementById(elementName),
          platform = initMapPlatform({
            'app_id': appId,
            'app_code': appCode,
            'useCIT': useCIT,
            'useHTTPS': useHTTPS
          }),
          defaultLayers = platform.createDefaultLayers({
            tileSize: pixelRatio === 1 ? 256 : 512,
            ppi: pixelRatio === 1 ? undefined : 320
          }),
          map = new window.H.Map(
            mapElement,
            defaultLayers.normal.map, {pixelRatio: pixelRatio}
          )
    mapInstance.map = map
    mapInstance.defaultLayers = defaultLayers
    mapInstance.behaviour = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
    createMapInterface()
}

function validateConfig(config){
  return config.appId && config.appCode ? true : false
}

export function mapInit(config){
  if(validateConfig(config)){
    createMap(config)
  } else {
    console.log('[MAP.SERVICE] mapInit | invalid config properties')
  }
}

export default mapInstance