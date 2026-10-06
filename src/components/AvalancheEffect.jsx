import { useState, useEffect, useRef } from 'react'
import { algorithms, generateHash, getAlgorithmInfo, countDifferentBits, getCharDiffMap } from '../utils/hashing'

function autoVariant(password) {
  if (!password) return ''
  const chars = [...password]
  const lastIndex = chars.length - 1
  const last = chars[lastIndex]
  const code = last.charCodeAt(0)
  chars[lastIndex] = String.fromCharCode(code === 126 ? 33 : code + 1)
  return chars.join('')
}

export default function AvalancheEffect({ algorithm: parentAlgorithm }) {
  const [passwordA, setPasswordA] = useState('password123')
  const [passwordB, setPasswordB] = useState('password124')
  const [algo, setAlgo] = useState(parentAlgorithm || 'SHA-256')
  const [result, setResult] = useState(null)
  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState('')
  const [autoB, setAutoB] = useState(true)
  const resultRef = useRef(null)

  useEffect(() => {
    if (parentAlgorithm) setAlgo(parentAlgorithm)
  }, [parentAlgorithm])

  useEffect(() => {
    if (autoB) setPasswordB(autoVariant(passwordA))
  }, [passwordA, autoB])

  async function compare() {
    if (!passwordA || !passwordB) {
      setError('Enter both passwords to compare their hashes.')
      return
    }
    if (passwordA === passwordB) {
      setError('The passwords are identical — change at least one character to see the avalanche effect.')
      return
    }
    setError('')
    setIsComparing(true)
    setResult(null)
    try {
      const [hashA, hashB] = await Promise.all([
        generateHash(passwordA, algo),
        generateHash(passwordB, algo),
      ])
      await new Promise((r) => setTimeout(r, 320))
      const info = getAlgorithmInfo(algo)
      const totalBits = info.bits
      const changedBits = countDifferentBits(hashA, hashB)
      const charDiff = getCharDiffMap(hashA, hashB)
      const changedChars = charDiff.filter(Boolean).length
      const percentage = ((changedBits / totalBits) * 100).toFixed(1)
      setResult({ hashA, hashB, charDiff, changedBits, changedChars, totalBits, totalChars: info.hexLength, percentage })
    } catch {
      setError('Something went wrong while comparing the hashes.')
    } finally {
      setIsComparing(false)
    }
  }

  function handlePasswordBChange(value) {
    setAutoB(false)
    setPasswordB(value)
  }

  function handlePasswordAChange(value) {
    setPasswordA(value)
    setAutoB(true)
    if (error) setError('')
  }

  function resetComparison() {
    setPasswordA('password123')
    setPasswordB('password124')
    setAutoB(true)
    setResult(null)
    setError('')
  }

  const info = getAlgorithmInfo(algo)

  return <section className="avalanche-section" aria-labelledby="avalanche-title">
    <div className="section-heading">
      <p className="eyebrow">Experiment 02</p>
      <h2 id="avalanche-title">Avalanche effect</h2>
      <p>Change a single character and observe how broadly the hash digest changes. A good hash function should change roughly 50% of all output bits.</p>
    </div>

    <div className="avalanche-workspace">
      {/* Input Panel */}
      <div className="avalanche-input-panel">
        <div className="panel-kicker"><span className="input-sigil" aria-hidden="true">Δ</span> Comparison inputs</div>

        <div className="compare-inputs">
          <div className="field-wrap">
            <label htmlFor="avl-pw-a">Password A</label>
            <div className="password-control">
              <input id="avl-pw-a" type="text" value={passwordA} onChange={(e) => handlePasswordAChange(e.target.value)} placeholder="Enter first password" aria-label="Password A for avalanche comparison" />
            </div>
          </div>

          <div className="avl-arrow" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            <span className="avl-arrow-label">1 char changed</span>
          </div>

          <div className="field-wrap">
            <label htmlFor="avl-pw-b">
              Password B
              {autoB && <span className="auto-badge">auto-generated</span>}
            </label>
            <div className="password-control">
              <input id="avl-pw-b" type="text" value={passwordB} onChange={(e) => handlePasswordBChange(e.target.value)} placeholder="Enter second password" aria-label="Password B for avalanche comparison" />
            </div>
          </div>

          <div className="field-wrap">
            <label htmlFor="avl-algo">Algorithm</label>
            <div className="select-control">
              <select id="avl-algo" value={algo} onChange={(e) => { setAlgo(e.target.value); setResult(null) }}>
                {algorithms.map((name) => <option value={name} key={name}>{name}</option>)}
              </select>
              <span aria-hidden="true">⌄</span>
            </div>
            <p className="field-help">{info.bits}-bit digest · {info.hexLength} hex characters</p>
          </div>

          <div className="avl-button-row">
            <button type="button" className="generate-button" onClick={compare} disabled={isComparing}>
              {isComparing ? <><span className="spinner" /> Comparing...</> : 'Compare hashes'}
            </button>
            <button type="button" className="secondary-button" onClick={resetComparison} aria-label="Reset avalanche comparison">Reset</button>
          </div>

          {error && <p className="field-error" role="alert">{error}</p>}
        </div>
      </div>

      {/* Result Panel */}
      <div className="avalanche-result-panel" ref={resultRef}>
        {result ? <>
          {/* Bit diff summary */}
          <div className="avl-stats-bar">
            <div className="avl-stat">
              <span className="avl-stat-value avl-stat-highlight">{result.percentage}%</span>
              <span className="avl-stat-label">bits changed</span>
            </div>
            <div className="avl-stat">
              <span className="avl-stat-value">{result.changedBits}</span>
              <span className="avl-stat-label">of {result.totalBits} bits</span>
            </div>
            <div className="avl-stat">
              <span className="avl-stat-value">{result.changedChars}</span>
              <span className="avl-stat-label">of {result.totalChars} hex chars</span>
            </div>
          </div>

          {/* Bit diff progress bar */}
          <div className="avl-diff-bar-wrap">
            <div className="avl-diff-bar-track">
              <div className="avl-diff-bar-fill" style={{ '--pct': `${result.percentage}%` }} />
            </div>
            <div className="avl-diff-bar-labels">
              <span>0% identical</span>
              <span className="avl-ideal">~50% ideal</span>
              <span>100% different</span>
            </div>
          </div>

          {/* Side-by-side hashes */}
          <div className="avl-hash-comparison">
            <div className="avl-hash-block">
              <div className="avl-hash-label"><span className="avl-badge avl-badge-a">A</span> Hash A</div>
              <code className="avl-hash-code">{result.hashA.split('').map((ch, i) =>
                <span key={`a${i}`} className={result.charDiff[i] ? 'avl-diff' : 'avl-same'} style={{ '--ci': i }}>{ch}</span>
              )}</code>
            </div>
            <div className="avl-hash-block">
              <div className="avl-hash-label"><span className="avl-badge avl-badge-b">B</span> Hash B</div>
              <code className="avl-hash-code">{result.hashB.split('').map((ch, i) =>
                <span key={`b${i}`} className={result.charDiff[i] ? 'avl-diff' : 'avl-same'} style={{ '--ci': i }}>{ch}</span>
              )}</code>
            </div>
          </div>

          {/* Legend */}
          <div className="avl-legend">
            <span><i className="avl-swatch avl-swatch-same" aria-hidden="true" /> Identical</span>
            <span><i className="avl-swatch avl-swatch-diff" aria-hidden="true" /> Changed</span>
          </div>
        </> : <div className="avl-empty">
          <div className="avl-empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="1.5" opacity=".6"/></svg>
          </div>
          <h3>Ready to compare</h3>
          <p>Enter two passwords and click <strong>Compare hashes</strong> to visualize how a tiny input change cascades through the hash output.</p>
        </div>}
      </div>
    </div>

    <p className="disclaimer">This visualization is an educational aid. Character comparison shows the observable effect; formal avalanche properties are measured at the bit level.</p>
  </section>
}
