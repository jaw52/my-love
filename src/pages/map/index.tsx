import React from 'react'

import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/all'
import styles from './index.module.css'
import GdMap from '~/components/ui/GdMap'
import { pageColor } from '~/config/params'
import { AliyunGEODataVUrl, Locations } from '~/config/gdMap'
import ParabolicSVG from '~/components/ui/ParabolicSVG'

export default function Map() {
  function mapOnload(map: any) {
    window.mapInstance = map
    map.on('complete', () => {
      // 地图图块加载完成后触发
      initCity(Locations, map)
    })
  }

  /**
   * 1. 设置动画路径
   * 2. 开启 GSAP 动画
   */
  const [parabolicCoords, setParabolicCoords] = React.useState([0, 0])
  function startAnimation(
    e: React.MouseEvent | MouseEvent,
    domId: string,
  ) {
    setParabolicCoords([e.clientX, e.clientY])
    const movingDiv = document.getElementById(domId)

    if (movingDiv) {
      const tl = gsap.timeline({ repeat: 0, repeatDelay: 1 })
      tl.to(movingDiv, {
        duration: 2,
        motionPath: {
          path: '#parabolicPath',
          align: '#parabolicPath',
          alignOrigin: [0.5, 0.5],
        },
        // ease: 'elastic',
      })
    }
  }

  React.useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin)
  }, [])

  /**
   * 根据城市行政区划代码从阿里云查询地图边界，上图
   */
  function initCity(cities: typeof Locations, map: any) {
    cities.forEach((item) => {
      fetch(AliyunGEODataVUrl + item.code)
        .then((response) => { return response.json() })
        .then((city) => {
          initPolygonAndMarker(city, map, item)
        })
    })
  }

  function initPolygonAndMarker(json: any, map: any, city: typeof Locations[number]) {
    const AMap = window.AMap
    const geojson = new AMap.GeoJSON({
      geoJSON: json,
      getPolygon(geojson: any, lnglats: any) {
        const area = AMap.GeometryUtil.ringArea(lnglats[0])
        const polygon = new AMap.Polygon({
          path: lnglats,
          strokeOpacity: 0.4,
          strokeColor: '#BBD5AA',
          strokeWeight: 2,
          strokeStyle: 'dashed',
          strokeDasharray: [5, 5],
          fillColor: '#BBD5AA',
          fillOpacity: 0.3, // 面积越大透明度越高
        })
        polygon.on('mouseover', () => {
          polygon.setOptions({
            fillOpacity: 0.1,
          })
        })
        polygon.on('mouseout', () => {
          polygon.setOptions({
            fillOpacity: 0.3,
          })
        })
        return polygon
      },
    })
    map.add(geojson)

    const center = json.features[0]?.properties?.center
    const markerId = `marker${city.id}`
    const content = `
    <div id="${markerId}" class="hover:scale-110 flex flex-col items-center space-y-0.5 w-fit" style="max-width: 150px;">
      <div class="hover:animate-[shake_1.5s_ease-in-out_infinite] border-2 rounded border-solid px-1.5 flex items-center space-x-0.5 overflow-hidden w-fit cursor-pointer shadow-[rgba(170,166,170,0.40)] shadow-md bg-[rgba(152,208,255,0.5)] border-white py-[0.1875rem]">
        <img
          src="/logo.png"
          class="w-4 h-4 block "
        >
      </div>
    </div>
  `
    const cityMarker = new AMap.Marker({
      position: center,
      offset: new AMap.Pixel(0, -10),
      content,
      title: '足迹',
      zIndex: 999,
      zoom: 13,
      id: city.id,
      autoRotation: true,
      map,
      extData: { id: markerId },
      // label: {
      //   direction: 'bottom',
      //   content: labelContent,
      //   offset: labelOffset,
      // },
    })

    cityMarker.on('click', (e: any) => {
      startAnimation(e.originEvent, markerId)
    })
  }

  return (
    <div
      className='w-screen h-screen overflow-hidden flex flex-col justify-center items-center box-border'
      style={{ background: pageColor.map }}
    >

      {/* 抛物线 */}
      <ParabolicSVG coords={parabolicCoords} />

      {/* 地图 */}
      <div className="w-70vw h-[calc(100%_-_9rem)] z-1 relative overflow-hidden ">
        <GdMap
          className="rounded-20px overflow-hidden"
          onload={mapOnload}
        />

        {/* border 样式 */}
        <div className={styles.scratchyBorder}>
          <div className={styles.frames}>
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className={styles.corners}>
            <div />
            <div />
          </div>
        </div>
      </div>

      {/* title and close */}
      <div className="absolute top-36 left-36 flex flex-col w-14 items-start gap-4 z-9">
        {/* <EarthEmoji
          className="text-14 pointer-events-auto cursor-pointer "
          onClick={(e) => {
            viewNavigate(navigate, '/', e, { type: 'shrink', color: '#BBD5AA' })
          }}
        /> */}
        {/* <div className="text-6 tracking-3 font-bold write-vertical-right mx-auto">
          留下的足迹
        </div> */}
      </div>

    </div>
  )
}
