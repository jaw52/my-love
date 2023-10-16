import React from 'react'
import { useNavigate } from 'react-router-dom'
import { viewNavigate } from '~/hooks/useViewNavigate'
import { ThemePalettes } from '~/config/params'

interface IPropsType {
  setFillColor: React.Dispatch<React.SetStateAction<string>>
  clearCanvas: () => void
}
export default function Three({ setFillColor, clearCanvas }: IPropsType) {
  const navigate = useNavigate()

  return (
    <div className=" font-semibold text-[#3E4857] text-6 select-none gap-12 tracking-2 leading-14 max-w-70vw">

      <span className="inline">
        期待我們的
      </span>

      <span
        className="inline-block text-8 text-transparent hover:!scale-110 cursor-pointer"
        style={{
          WebkitTextStroke: '2px #3E4857',
          transition: 'transform 0.3s linear',
        }}

        onPointerOver={() => {
          setFillColor(ThemePalettes.green)
        }}
        onClick={(e) => {
          viewNavigate(navigate, '/map', e, { type: 'expand', color: ThemePalettes.green })
        }}
      >
        <span >足跡</span>
      </span>
      <span className="inline">
        點亮更多地方，
      </span>

      <span className="inline">
        探尋一起生活中的
      </span>

      <span
        className="inline-block text-8 text-transparent hover:!scale-110 cursor-pointer"
        style={{
          WebkitTextStroke: '2px #3E4857',
          transition: 'transform 0.3s linear',
        }}
        onPointerOver={() => setFillColor(ThemePalettes.yellow)}
      >
        各種可能
      </span>
      <span
        className="inline hover:!scale-110 cursor-pointer"
        onClick={(e) => {
          clearCanvas()
        }}
      >
        🎨。
      </span>

    </div>
  )
}
