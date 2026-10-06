import { useState, useMemo } from 'react'

const COMMON_PATTERNS = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'login', 'master', 'dragon', 'shadow', 'sunshine', 'trustno1', 'iloveyou', '123123', '654321', 'football', 'baseball', 'access', '696969', 'batman', 'passw0rd']

const SEQUENTIAL = ['012', '123', '234', '345', '456', '567', '678', '789', '890', 'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz']

const KEYBOARD_PATTERNS = ['qwert', 'werty', 'ertyu', 'asdf', 'sdfg', 'dfgh', 'zxcv', 'xcvb', 'cvbn', 'qazwsx', 'zaq1']

function analyze(password) {
  if (!password) return null

  const len = password.length
  const lower = password.toLowerCase()
  const criteria = []
  const suggestions = []

  /* 1 — Length */
  const lengthScore = len >= 16 ? 3 : len >= 12 ? 2 : len >= 8 ? 1 : 0
  criteria.push({ id: 'length', label: `Length (${len} characters)`, pass: len >= 8, detail: len >= 16 ? 'Excellent length' : len >= 12 ? 'Good length' : len >= 8 ? 'Acceptable length' : 'Too short' })
  if (len < 12) suggestions.push('Use at least 12 characters for better security.')

  /* 2 — Lowercase */
  const hasLower = /[a-z]/.test(password)
  criteria.push({ id: 'lower', label: 'Lowercase letters (a–z)', pass: hasLower })
  if (!hasLower) suggestions.push('Add lowercase letters.')

  /* 3 — Uppercase */
  const hasUpper = /[A-Z]/.test(password)
  criteria.push({ id: 'upper', label: 'Uppercase letters (A–Z)', pass: hasUpper })
  if (!hasUpper) suggestions.push('Add uppercase letters.')

  /* 4 — Digits */
  const hasDigit = /\d/.test(password)
  criteria.push({ id: 'digit', label: 'Numbers (0–9)', pass: hasDigit })
  if (!hasDigit) suggestions.push('Include at least one number.')

  /* 5 — Special characters */
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  criteria.push({ id: 'special', label: 'Special characters (!@#$…)', pass: hasSpecial })
  if (!hasSpecial) suggestions.push('Add special characters like !@#$%^&*.')

  /* 6 — Repeated characters */
  const hasRepeats = /(.)\1{2,}/.test(password)
  criteria.push({ id: 'repeats', label: 'No excessive repeats', pass: !hasRepeats })
  if (hasRepeats) suggestions.push('Avoid repeating the same character three or more times.')

  /* 7 — Common patterns */
  const hasCommon = COMMON_PATTERNS.some((p) => lower.includes(p))
  criteria.push({ id: 'common', label: 'No common patterns', pass: !hasCommon })
  if (hasCommon) suggestions.push('Avoid common words like "password", "admin", or "qwerty".')

  /* 8 — Sequential characters */
  const hasSequential = SEQUENTIAL.some((s) => lower.includes(s))
  criteria.push({ id: 'sequential', label: 'No sequential runs', pass: !hasSequential })
  if (hasSequential) suggestions.push('Avoid sequential patterns like "abc" or "123".')

  /* 9 — Keyboard patterns */
  const hasKeyboard = KEYBOARD_PATTERNS.some((s) => lower.includes(s))
  criteria.push({ id: 'keyboard', label: 'No keyboard patterns', pass: !hasKeyboard })
  if (hasKeyboard) suggestions.push('Avoid keyboard patterns like "qwerty" or "asdf".')

  /* Score calculation */
  const passCount = criteria.filter((c) => c.pass).length
  const baseScore = (passCount / criteria.length) * 70
  const lengthBonus = Math.min(lengthScore * 10, 30)
  const score = Math.min(100, Math.round(baseScore + lengthBonus))

  let level, levelClass
  if (score <= 30) { level = 'Weak'; levelClass = 'str-weak' }
  else if (score <= 55) { level = 'Fair'; levelClass = 'str-fair' }
  else if (score <= 79) { level = 'Good'; levelClass = 'str-good' }
  else { level = 'Strong'; levelClass = 'str-strong' }

  return { score, level, levelClass, criteria, suggestions }
}

function CheckIcon() {
  return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L19 7"/></svg>
}
function CrossIcon() {
  return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg>
}

export default function PasswordStrength({ password }) {
  const [expanded, setExpanded] = useState(false)
  const data = useMemo(() => analyze(password), [password])

  if (!data) return null

  return <div className="strength-meter" aria-label={`Password strength indicator: ${data.level}`}>
    <button type="button" className="strength-toggle" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} aria-controls="str-details">
      <div className="strength-header">
        <span>Password strength</span>
        <strong className={data.levelClass}>{data.level}</strong>
      </div>
      <div className="strength-bar-track" aria-hidden="true">
        <div className={`strength-bar-fill ${data.levelClass}`} style={{ '--pct': `${data.score}%` }} />
      </div>
      <span className="strength-chevron" aria-hidden="true">{expanded ? '▴' : '▾'}</span>
    </button>

    {expanded && <div id="str-details" className="strength-details">
      <ul className="criteria-list" aria-label="Password criteria">
        {data.criteria.map((c) => <li key={c.id} className={c.pass ? 'criteria-pass' : 'criteria-fail'}>
          {c.pass ? <CheckIcon /> : <CrossIcon />}
          <span>{c.label}</span>
          {c.detail && <em>{c.detail}</em>}
        </li>)}
      </ul>

      {data.suggestions.length > 0 && <div className="str-suggestions">
        <p className="str-suggestions-title">Suggestions</p>
        <ul>
          {data.suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>}
    </div>}

    <p className="str-disclaimer">Educational indicator only — not a guarantee of real-world security.</p>
  </div>
}
