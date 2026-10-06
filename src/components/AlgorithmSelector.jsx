import { algorithms, getAlgorithmInfo } from '../utils/hashing'

export default function AlgorithmSelector({ algorithm, onChange }) {
  const info = getAlgorithmInfo(algorithm)
  return <div className="field-wrap">
    <label htmlFor="algorithm">Algorithm</label>
    <div className="select-control">
      <select id="algorithm" value={algorithm} onChange={(event) => onChange(event.target.value)}>
        {algorithms.map((name) => <option value={name} key={name}>{name}</option>)}
      </select>
      <span aria-hidden="true">⌄</span>
    </div>
    <p className="field-help">{info.bits}-bit digest · {info.hexLength} hexadecimal characters</p>
  </div>
}
