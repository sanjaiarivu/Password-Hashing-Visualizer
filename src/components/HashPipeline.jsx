export default function HashPipeline({ algorithm, password, active }) {
  const stages = [
    ['01', 'PASSWORD', password ? `${password.length} character${password.length === 1 ? '' : 's'} received` : 'awaiting input'],
    ['02', 'HASH FUNCTION', algorithm],
    ['03', 'DIGEST', active ? 'transforming bytes' : 'fixed-length output'],
    ['04', 'HASH OUTPUT', active ? 'digest ready' : 'ready to generate'],
  ]
  return <section className={`pipeline-panel ${active ? 'is-active' : ''}`} aria-label="Hashing pipeline">
    <div className="panel-kicker"><span className="pulse-dot" aria-hidden="true" /> Live processing map</div>
    <div className="pipeline">
      {stages.map(([step, title, detail], index) => <div className="pipeline-stage" key={title} style={{ '--step': index }}>
        <div className="stage-number">{step}</div>
        <div><p>{title}</p><span>{detail}</span></div>
        {index < stages.length - 1 && <div className="flow-line" aria-hidden="true"><i /></div>}
      </div>)}
    </div>
    <p className="pipeline-note">A hash is one-way: the original password cannot be recovered from its digest.</p>
  </section>
}
