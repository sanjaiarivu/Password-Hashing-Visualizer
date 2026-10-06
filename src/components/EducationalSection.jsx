export default function EducationalSection() {
  return <section className="education-grid" aria-label="Hashing concepts">
    {/* Existing card — Hashing vs Encryption */}
    <article className="education-card">
      <p className="eyebrow">Hashing vs encryption</p>
      <h2>Different tools, different jobs.</h2>
      <div className="comparison-cards">
        <div>
          <span>Hashing</span>
          <strong>One-way transformation</strong>
          <p>Used for password verification without retaining the original password.</p>
        </div>
        <div>
          <span>Encryption</span>
          <strong>Reversible with a key</strong>
          <p>Used when protected data must later be recovered.</p>
        </div>
      </div>
    </article>

    {/* Existing card — How hashing works */}
    <article className="education-card process-card">
      <p className="eyebrow">How hashing works</p>
      <ol>
        <li><b>01</b><span>User enters a password</span></li>
        <li><b>02</b><span>The algorithm processes its bytes</span></li>
        <li><b>03</b><span>A digest is generated</span></li>
        <li><b>04</b><span>A fixed-length hash is returned</span></li>
      </ol>
    </article>

    {/* New card — What is the Avalanche Effect? */}
    <article className="education-card edu-avalanche">
      <p className="eyebrow">Concept</p>
      <h2>What is the Avalanche Effect?</h2>
      <p>The avalanche effect is a property of good hash functions: <strong>changing even one bit of the input should change roughly 50% of the output bits.</strong></p>
      <p>This means two nearly identical passwords — like <code>hello123</code> and <code>hello124</code> — produce hashes that look completely unrelated. There is no pattern an attacker can exploit to guess how a small change affects the output.</p>
      <div className="edu-example">
        <div><span>Input change</span><strong>1 character</strong></div>
        <div><span>Output change</span><strong>~50% of all bits</strong></div>
      </div>
    </article>

    {/* New card — Why does one small change produce a very different hash? */}
    <article className="education-card edu-diffusion">
      <p className="eyebrow">Deep dive</p>
      <h2>Why does one small change produce a very different hash?</h2>
      <p>Hash algorithms use multiple rounds of <strong>mixing</strong>, <strong>shifting</strong>, and <strong>combining</strong> operations. Each round spreads — or "diffuses" — the effect of every input bit across the entire output.</p>
      <p>Think of it like adding a single drop of dye to a glass of water and then stirring vigorously. After many stirs, the dye is spread everywhere, and the result looks nothing like the single drop you started with.</p>
      <p>This diffusion is what makes hash functions useful for security: an attacker cannot figure out what the original password was, even if they know the hash.</p>
    </article>

    {/* New card — Why is hashing useful for passwords? */}
    <article className="education-card edu-passwords">
      <p className="eyebrow">Real-world use</p>
      <h2>Why is hashing useful for passwords?</h2>
      <ol className="edu-steps">
        <li>
          <b>Storage</b>
          <span>Websites store the <em>hash</em> of your password, not the password itself. If the database is stolen, the attacker only sees hashes — not your actual password.</span>
        </li>
        <li>
          <b>Verification</b>
          <span>When you log in, the site hashes what you typed and compares it to the stored hash. If they match, you are in — without the site ever seeing or keeping your plaintext password.</span>
        </li>
        <li>
          <b>One-way</b>
          <span>Because hashing is one-way, there is no key or method to "reverse" a hash back into the password. Attackers must resort to brute-force guessing.</span>
        </li>
      </ol>
    </article>
  </section>
}
