import { useEffect, useState } from 'react'
import PasswordInput from './components/PasswordInput'
import AlgorithmSelector from './components/AlgorithmSelector'
import HashPipeline from './components/HashPipeline'
import HashResult from './components/HashResult'
import AvalancheEffect from './components/AvalancheEffect'
import EducationalSection from './components/EducationalSection'
import PasswordStrength from './components/PasswordStrength'
import Toast from './components/Toast'
import { generateHash } from './utils/hashing'

export default function App() {
  const [password, setPassword] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [hash, setHash] = useState('')
  const [inputLength, setInputLength] = useState(0)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [toast, setToast] = useState(null)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  async function handleGenerate(event) {
    event.preventDefault()
    if (!password) { setError('Enter a password to generate a hash.'); return }
    setError('')
    setRunId((current) => current + 1)
    setIsHashing(true)
    setHash('')
    try {
      const digest = await generateHash(password, algorithm)
      await new Promise((resolve) => window.setTimeout(resolve, 420))
      setHash(digest)
      setInputLength([...password].length)
    } catch (caught) {
      setError(caught.message === 'UNSUPPORTED' ? 'Selected algorithm is not available.' : 'Something went wrong while generating the hash.')
    } finally { setIsHashing(false) }
  }

  async function copyHash() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('No clipboard')
      await navigator.clipboard.writeText(hash)
      setToast({ message: 'Hash copied to clipboard', type: 'success' })
    } catch { setToast({ message: 'Unable to copy. Please copy the hash manually.', type: 'error' }) }
  }

  function handleClear() {
    setPassword('')
    setHash('')
    setError('')
    setInputLength(0)
    setVisible(false)
  }

  return <>
    <a className="skip-link" href="#workbench">Skip to hashing workbench</a>
    <main>
      <header className="hero">
        <div className="topline"><a className="brand" href="#top" aria-label="HashLab home"><span aria-hidden="true">H</span> HashLab</a><div className="local-status"><i aria-hidden="true" /> Local processing</div></div>
        <div className="hero-copy" id="top"><p className="eyebrow">Password hashing visualizer</p><h1>See what happens when a password becomes a hash.</h1><p>Explore cryptographic hashing algorithms through an interactive visual laboratory.</p></div>
        <p className="browser-note">Your password never leaves this browser.</p>
      </header>

      <section className="workbench" id="workbench" aria-labelledby="workbench-title">
        <div className="workbench-heading"><div><p className="eyebrow">Experiment 01</p><h2 id="workbench-title">Hash generation workbench</h2></div><span>Web Crypto API</span></div>
        <div className="workbench-grid">
          <form className="input-panel" onSubmit={handleGenerate} noValidate>
            <div className="panel-kicker"><span className="input-sigil" aria-hidden="true">›_</span> Input controls</div>
            <PasswordInput value={password} onChange={(value) => { setPassword(value); if (error) setError('') }} visible={visible} onToggle={() => setVisible((current) => !current)} error={error} />
            <PasswordStrength password={password} />
            <AlgorithmSelector algorithm={algorithm} onChange={setAlgorithm} />
            <button className="generate-button" type="submit" disabled={isHashing}>{isHashing ? <><span className="spinner" /> Processing...</> : 'Generate hash'}</button>
          </form>
          <HashPipeline key={runId} algorithm={algorithm} password={password} active={isHashing || Boolean(hash)} />
          <HashResult hash={hash} algorithm={algorithm} inputLength={inputLength} onCopy={copyHash} onClear={hash ? handleClear : undefined} hashKey={runId} />
        </div>
      </section>
      <AvalancheEffect algorithm={algorithm} />
      <EducationalSection />
      <footer>HashLab · Educational cryptographic workbench · No passwords retained</footer>
    </main>
    <Toast message={toast?.message} type={toast?.type} />
  </>
}
