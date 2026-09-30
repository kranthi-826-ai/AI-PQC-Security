import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Activity, ArrowRight, BrainCircuit, CheckCircle2, ChevronRight, Clock3,
  Database, Eye, Fingerprint, Gauge, KeyRound, Layers3, LockKeyhole,
  LogOut, Network, RefreshCw, Server, ShieldCheck, Sparkles, TriangleAlert
} from 'lucide-react';
import './styles.css';
import './execution.css';

export const api = async (path, token, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}
  });
  if (!response.ok) {
    const error = new Error((await response.json().catch(() => ({}))).message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const labelize = value => value ? value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase()) : 'Not available';
const riskTone = value => value?.toLowerCase() || 'neutral';

function Login({onLogin}) {
  const [username, setUsername] = useState('brunouser');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await api('/api/v1/auth/login', '', {
        method: 'POST', body: JSON.stringify({username, password})
      });
      sessionStorage.setItem('pqcToken', result.token);
      onLogin(result.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="login-page">
    <section className="login-story" aria-label="Platform overview">
      <div className="brand brand-large"><span className="brand-mark"><ShieldCheck/></span><span>AI-PQC Shield</span></div>
      <div className="login-copy">
        <span className="eyebrow">ADAPTIVE SECURITY RESEARCH PLATFORM</span>
        <h1>Security that adapts before data leaves the service.</h1>
        <p>AI evaluates network risk, an explainable policy selects the protection level, and standardized cryptography secures the response.</p>
      </div>
      <div className="login-flow">
        <FlowPoint icon={<Activity/>} title="Observe" text="Network and API signals"/>
        <FlowPoint icon={<BrainCircuit/>} title="Decide" text="AI risk and policy"/>
        <FlowPoint icon={<LockKeyhole/>} title="Protect" text="Classical, hybrid or PQC"/>
      </div>
      <p className="research-note"><Sparkles/> Research prototype using UNSW-NB15 and NIST-standardized PQC algorithms.</p>
    </section>
    <section className="login-panel">
      <form onSubmit={submit}>
        <div className="mobile-brand brand"><ShieldCheck/><span>AI-PQC Shield</span></div>
        <span className="eyebrow">SECURE ACCESS</span>
        <h2>Welcome back</h2>
        <p>Sign in to view the adaptive security control plane.</p>
        <label>Username<input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} /></label>
        <label>Password<input autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>
        {error && <div className="error" role="alert">{error}</div>}
        <button className="primary-button" disabled={submitting}>{submitting ? 'Verifying…' : 'Sign in securely'}<ArrowRight/></button>
        <div className="trust-row"><ShieldCheck/><span>JWT-protected session · Passwords stored with BCrypt</span></div>
      </form>
    </section>
  </main>;
}

function FlowPoint({icon, title, text}) {
  return <div><span>{icon}</span><section><strong>{title}</strong><small>{text}</small></section></div>;
}

function Dashboard({token, onLogout}) {
  const [events, setEvents] = useState([]);
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [eventData, runData] = await Promise.all([
        api('/api/v1/events', token), api('/api/v1/business/executions', token)
      ]);
      setEvents(eventData);
      setRuns(runData);
      setUpdatedAt(new Date());
    } catch (requestError) {
      if (requestError.status === 401) { onLogout(); return; }
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const successful = runs.filter(run => run.outcome === 'SUCCESS').length;
    const denied = events.filter(event => event.outcome === 'DENIED' || event.outcome === 'FAILURE').length;
    return {
      events: events.length,
      runs: runs.length,
      denied,
      success: runs.length ? Math.round(successful / runs.length * 100) : 0,
      latency: runs.length ? Math.round(runs.reduce((sum, run) => sum + run.totalLatencyMillis, 0) / runs.length) : 0
    };
  }, [events, runs]);

  const latest = runs[0];
  const latestEvent = events[0];
  const decisionReason = latest?.selectionReason || explainMode(latest);

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><ShieldCheck/></span><span>AI-PQC Shield</span></div>
      <span className="workspace-label">RESEARCH WORKSPACE</span>
      <nav aria-label="Dashboard sections">
        <a className="active" href="#overview"><Activity/><span>Overview</span></a>
        <a href="#decision"><BrainCircuit/><span>Decision journey</span></a>
        <a href="#executions"><LockKeyhole/><span>Crypto executions</span></a>
        <a href="#events"><TriangleAlert/><span>Security events</span></a>
      </nav>
      <div className="system-card"><span className="live-dot"/><div><strong>System operational</strong><small>AI, policy and crypto online</small></div></div>
      <button className="logout" onClick={onLogout}><LogOut/>Sign out</button>
    </aside>

    <main className="dashboard" id="overview">
      <header className="topbar">
        <div><span className="eyebrow">SECURITY CONTROL PLANE</span><h1>Adaptive security overview</h1><p>Trace each request from observed risk to verified cryptographic protection.</p></div>
        <div className="header-actions"><span className="updated">{updatedAt ? `Updated ${updatedAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'Connecting…'}</span><button className="refresh" onClick={load} disabled={loading}><RefreshCw className={loading ? 'spin' : ''}/>{loading ? 'Refreshing' : 'Refresh data'}</button></div>
      </header>

      {error && <div className="error" role="alert">Unable to refresh dashboard: {error}</div>}
      <section className="status-strip"><CheckCircle2/><div><strong>End-to-end adaptive protection is active</strong><span>Gateway → authentication → AI risk → policy → cryptography → audit</span></div><span className="status-badge">LIVE</span></section>

      <section className="metric-grid" aria-label="System metrics">
        <Metric icon={<TriangleAlert/>} label="Observed events" value={stats.events} detail={`${stats.denied} denied or failed`} tone="amber"/>
        <Metric icon={<BrainCircuit/>} label="Adaptive decisions" value={stats.runs} detail="AI-informed executions" tone="blue"/>
        <Metric icon={<ShieldCheck/>} label="Verified protection" value={`${stats.success}%`} detail="Crypto round trips passed" tone="green"/>
        <Metric icon={<Clock3/>} label="Mean flow latency" value={`${stats.latency} ms`} detail="Policy and cryptography" tone="violet"/>
      </section>

      <section className="section-heading" id="decision"><div><span className="section-number">01</span><div><h2>Why this protection was selected</h2><p>A readable chain from the observed activity to the applied algorithm.</p></div></div><RiskLegend/></section>

      <section className="decision-journey">
        <JourneyStep number="1" icon={<Network/>} title="Request observed" badge={latestEvent ? labelize(latestEvent.eventType) : 'Waiting'}>
          <p>{latestEvent ? `${latestEvent.sourceService} recorded a ${latestEvent.outcome.toLowerCase()} request.` : 'No security event has been collected yet.'}</p>
          <small>Signals are captured without storing the protected payload.</small>
        </JourneyStep>
        <ChevronRight className="journey-arrow"/>
        <JourneyStep number="2" icon={<BrainCircuit/>} title="AI risk assessed" badge={latest ? `${Math.round(latest.riskScore * 100)}% ${latest.riskLevel}` : 'Waiting'} tone={riskTone(latest?.riskLevel)}>
          <p>{riskDescription(latest)}</p>
          <small>Model version: {latest?.modelVersion?.slice(0, 12) || 'Not available'}</small>
        </JourneyStep>
        <ChevronRight className="journey-arrow"/>
        <JourneyStep number="3" icon={<Layers3/>} title="Policy selected" badge={latest?.selectedMode || 'Waiting'} tone={riskTone(latest?.riskLevel)}>
          <p>{decisionReason}</p>
          <small>Policy version: {latest?.policyVersion || 'Not available'}</small>
        </JourneyStep>
        <ChevronRight className="journey-arrow"/>
        <JourneyStep number="4" icon={<Fingerprint/>} title="Protection verified" badge={latest?.roundTripVerified ? 'VERIFIED' : 'Waiting'} tone={latest?.roundTripVerified ? 'success' : 'neutral'}>
          <p>{latest?.algorithmProfile || 'No cryptographic profile has been executed yet.'}</p>
          <small>{latest ? `${latest.cryptoLatencyMillis} ms cryptography · ${latest.totalLatencyMillis} ms total` : 'Awaiting execution'}</small>
        </JourneyStep>
      </section>

      <section className="explanation-grid">
        <article className="panel risk-panel">
          <div className="panel-heading"><div><span className="icon-box blue"><Gauge/></span><div><h3>Latest AI assessment</h3><p>Probability-based risk, not a hard-coded attack label</p></div></div><span className={`risk-chip ${riskTone(latest?.riskLevel)}`}>{latest?.riskLevel || 'NO DATA'}</span></div>
          <div className="risk-content"><div className={`risk-gauge ${riskTone(latest?.riskLevel)}`} style={{'--score': `${latest ? Math.round(latest.riskScore * 100) : 0}%`}}><div><strong>{latest ? Math.round(latest.riskScore * 100) : 0}%</strong><span>risk score</span></div></div><div className="risk-copy"><h4>{riskHeadline(latest)}</h4><p>{riskDescription(latest)}</p><div className="thresholds"><span><i className="low"/>Low 0–39%</span><span><i className="medium"/>Medium 40–69%</span><span><i className="high"/>High 70–100%</span></div></div></div>
        </article>
        <article className="panel rationale-panel">
          <div className="panel-heading"><div><span className="icon-box violet"><KeyRound/></span><div><h3>Policy rationale</h3><p>Explainable mapping from risk to cryptography</p></div></div></div>
          <div className="mode-callout"><span className="mode-label">SELECTED MODE</span><strong>{latest?.selectedMode || 'Awaiting decision'}</strong><code>{latest?.algorithmProfile || 'No algorithm profile selected'}</code></div>
          <p className="reason"><Eye/>{decisionReason}</p>
        </article>
      </section>

      <LatencyPanel latest={latest}/>
      <ExecutionTable runs={runs}/>
      <EventTable events={events}/>

      <footer><ShieldCheck/><span>AI-PQC Shield research prototype</span><i/> <span>Evidence is auditable by correlation ID, model version and policy version.</span></footer>
    </main>
  </div>;
}

function explainMode(run) {
  if (!run) return 'Run an adaptive request to see the exact policy explanation.';
  if (run.selectedMode === 'PQC') return 'High assessed risk and PQC compatibility triggered the strongest post-quantum profile.';
  if (run.selectedMode === 'HYBRID') return 'The policy balanced elevated risk with compatibility by combining classical and post-quantum protection.';
  return 'The assessed risk and application constraints allowed the classical protection profile.';
}

function riskDescription(run) {
  if (!run) return 'The AI service will score network-flow features when an adaptive request is submitted.';
  if (run.riskLevel === 'HIGH') return 'The model found strong attack-like characteristics, so the policy requires PQC or a recorded compatibility fallback.';
  if (run.riskLevel === 'MEDIUM') return 'The flow contains suspicious characteristics and receives stronger hybrid protection when supported.';
  return 'The flow resembles normal traffic under the current model and can use the approved classical profile.';
}

function riskHeadline(run) {
  if (!run) return 'Awaiting a network-flow evaluation';
  if (run.riskLevel === 'HIGH') return 'Strong attack-like traffic characteristics detected';
  if (run.riskLevel === 'MEDIUM') return 'Suspicious traffic characteristics detected';
  return 'Traffic currently resembles the normal baseline';
}

function Metric({icon, label, value, detail, tone}) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}>{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>;
}

function RiskLegend() {
  return <div className="legend"><span><i className="low"/>Low</span><span><i className="medium"/>Medium</span><span><i className="high"/>High</span></div>;
}

function JourneyStep({number, icon, title, badge, tone = 'neutral', children}) {
  return <article className="journey-step"><div className="step-top"><span className="step-number">{number}</span><span className="step-icon">{icon}</span></div><h3>{title}</h3><span className={`journey-badge ${tone}`}>{badge}</span>{children}</article>;
}

function LatencyPanel({latest}) {
  return <article className="panel latency-panel"><div className="panel-heading"><div><span className="icon-box green"><Clock3/></span><div><h3>Execution performance</h3><p>Measured time for the latest end-to-end adaptive request</p></div></div><strong className="total-latency">{latest?.totalLatencyMillis || 0} ms <small>total</small></strong></div><div className="latency-bars"><Bar name="AI inference + policy" value={latest?.policyLatencyMillis || 0} total={latest?.totalLatencyMillis || 0}/><Bar name="Cryptographic execution" value={latest?.cryptoLatencyMillis || 0} total={latest?.totalLatencyMillis || 0}/><Bar name="Service overhead" value={latest ? Math.max(0, latest.totalLatencyMillis - latest.policyLatencyMillis - latest.cryptoLatencyMillis) : 0} total={latest?.totalLatencyMillis || 0}/></div></article>;
}

function ExecutionTable({runs}) {
  return <article className="panel data-panel" id="executions"><div className="panel-heading table-heading"><div><span className="icon-box violet"><LockKeyhole/></span><div><h3>Adaptive crypto executions</h3><p>Policy outcomes with verified cryptographic round trips</p></div></div><span className="record-count">{runs.length} records</span></div><div className="execution-table"><div className="table-header"><span>Risk</span><span>Protection mode</span><span>Reason</span><span>Verification</span><span>Latency</span></div>{runs.slice(0, 8).map(run => <div className="table-record" key={run.executionId}><span><i className={`risk-dot ${riskTone(run.riskLevel)}`}/><b>{run.riskLevel}</b><small>{Math.round(run.riskScore * 100)}%</small></span><span><b>{run.selectedMode}</b><small>{run.algorithmProfile}</small></span><span className="reason-cell">{run.selectionReason || explainMode(run)}</span><span className={`verification ${run.roundTripVerified ? 'success' : 'denied'}`}>{run.roundTripVerified ? <CheckCircle2/> : <TriangleAlert/>}{run.roundTripVerified ? 'Verified' : 'Failed'}</span><time>{run.totalLatencyMillis} ms</time></div>)}{!runs.length && <Empty/>}</div></article>;
}

function EventTable({events}) {
  return <article className="panel data-panel" id="events"><div className="panel-heading table-heading"><div><span className="icon-box amber"><Database/></span><div><h3>Security event timeline</h3><p>Authentication, authorization and protected API activity</p></div></div><span className="record-count">{events.length} records</span></div><div className="event-list">{events.slice(0, 10).map(event => <div className="event-record" key={event.eventId}><span className={`event-icon ${event.outcome.toLowerCase()}`}>{event.outcome === 'SUCCESS' ? <CheckCircle2/> : <TriangleAlert/>}</span><div><strong>{labelize(event.eventType)}</strong><small>{event.sourceService} · {event.username || 'System'}</small></div><code>{event.requestPath}</code><span className={`outcome ${event.outcome.toLowerCase()}`}>{event.outcome}</span><time>{new Date(event.occurredAt).toLocaleString()}</time></div>)}{!events.length && <Empty/>}</div></article>;
}

function Bar({name, value, total}) {
  const percent = Math.max(value ? 3 : 0, value / Math.max(total, 1) * 100);
  return <div className="latency-row"><div><span>{name}</span><b>{value} ms</b></div><div className="track"><i style={{width: `${percent}%`}}/></div></div>;
}

function Empty() { return <div className="empty"><Server/><div><strong>No records available yet</strong><span>Submit the adaptive Bruno request, then refresh this dashboard.</span></div></div>; }

export function App() {
  const [token, setToken] = useState(sessionStorage.getItem('pqcToken'));
  return token ? <Dashboard token={token} onLogout={() => { sessionStorage.removeItem('pqcToken'); setToken(null); }}/> : <Login onLogin={setToken}/>;
}

const rootElement = document.getElementById('root');
if (rootElement) createRoot(rootElement).render(<App/>);
