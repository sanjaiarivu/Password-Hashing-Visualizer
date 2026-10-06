const EyeIcon = ({ closed }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.6" />
    {closed && <path d="m4 4 16 16" />}
  </svg>
)

export default function PasswordInput({ value, onChange, visible, onToggle, error }) {
  return <div className="field-wrap">
    <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
    <div className={`password-control ${error ? 'has-error' : ''}`}>
      <input id="password" type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter password here" autoComplete="current-password" aria-describedby="password-help password-error" aria-invalid={Boolean(error)} />
      <button type="button" className="icon-button" onClick={onToggle} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}>
        <EyeIcon closed={visible} />
      </button>
    </div>
    <p id="password-help" className="field-help">Processed only in this browser. Nothing is saved.</p>
    {error && <p id="password-error" className="field-error" role="alert">{error}</p>}
  </div>
}
