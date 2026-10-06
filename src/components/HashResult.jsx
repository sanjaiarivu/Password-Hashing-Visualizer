import { getAlgorithmInfo } from '../utils/hashing'

function CopyIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
}

function ClearIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></svg>
}

export default function HashResult({ hash, algorithm, inputLength, onCopy, onClear, hashKey }) {
  const info = getAlgorithmInfo(algorithm)
  const groups = hash ? hash.match(/.{1,4}/g) : []
  return <section className="result-panel" aria-live="polite">
    <div className="panel-kicker"><span className="result-sigil" aria-hidden="true">#</span> Hash output</div>
    {hash ? <>
      <div className="result-meta">
        <div><span>Algorithm</span><strong>{algorithm}</strong></div>
        <div><span>Output</span><strong>{info.bits} bits</strong></div>
        <div><span>Input</span><strong>{inputLength} chars</strong></div>
        <div><span>Hex length</span><strong>{info.hexLength} chars</strong></div>
      </div>
      <div className="hash-label-row"><span>Digest</span><span>{info.hexLength} hex characters · {info.bits} bits</span></div>
      <code className="hash-grid hash-animated" key={hashKey} aria-label={`Generated ${algorithm} hash`}>
        {groups.map((group, index) => (
          <span key={`${hashKey}-${index}`} className="hash-char-group" style={{ '--group': index }}>{group}</span>
        ))}
      </code>
      <div className="hash-button-row">
        <button className="copy-button" type="button" onClick={onCopy}><CopyIcon /> Copy full hash</button>
        {onClear && <button className="clear-button" type="button" onClick={onClear}><ClearIcon /> Clear</button>}
      </div>
      <dl className="hash-info">
        <div><dt>Input length</dt><dd>{inputLength} characters</dd></div>
        <div><dt>Output size</dt><dd>{info.bits} bits</dd></div>
        <div><dt>Algorithm</dt><dd>{algorithm}</dd></div>
        <div><dt>Hex chars</dt><dd>{info.hexLength}</dd></div>
      </dl>
    </> : <div className="empty-result">
      <div className="empty-orbit" aria-hidden="true" />
      <h2>Awaiting digest</h2>
      <p>Generate a hash to inspect the fixed-length result here.</p>
    </div>}
  </section>
}
