import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Activity, BrainCircuit, Clock3, LockKeyhole, LogOut, RefreshCw, ShieldCheck, TriangleAlert} from 'lucide-react';
import './styles.css';
import './execution.css';

export const api = async (path, token, options = {}) => {
  const response = await fetch(path, {...options, headers: {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}});
  if (!response.ok) {
    const error = new Error((await response.json().catch(() => ({}))).message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

function Login({onLogin}) {
  const [username, setUsername] = useState('brunouser');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault(); setError('');
    try {
      const result = await api('/api/v1/auth/login', '', {method: 'POST', body: JSON.stringify({username, password})});
      sessionStorage.setItem('pqcToken', result.token); onLogin(result.token);
    } catch (requestError) { setError(requestError.message); }
  };
  return <main className="login"><form onSubmit={submit}><div className="brand"><ShieldCheck/><span>AI-PQC Shield</span></div><h1>Security operations</h1><p>Adaptive protection for distributed applications</p><label>Username<input value={username} onChange={event => setUsername(event.target.value)}/></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)}/></label>{error && <div className="error">{error}</div>}<button>Sign in securely</button></form></main>;
}

function Dashboard({token, onLogout}) {
  const [events, setEvents] = useState([]);
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const [eventData, runData] = await Promise.all([api('/api/v1/events', token), api('/api/v1/business/executions', token)]);
      setEvents(eventData); setRuns(runData);
    } catch (requestError) {
      if (requestError.status === 401) { onLogout(); return; }
      setError(requestError.message);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const stats = useMemo(() => {
    const successful = runs.filter(run => run.outcome === 'SUCCESS').length;
    return {events: events.length, runs: runs.length, success: runs.length ? Math.round(successful / runs.length * 100) : 0, latency: runs.length ? Math.round(runs.reduce((sum, run) => sum + run.totalLatencyMillis, 0) / runs.length) : 0};
  }, [events, runs]);
  const latest = runs[0];
  return <div className="shell"><aside><div className="brand"><ShieldCheck/><span>AI-PQC Shield</span></div><nav><a className="active" href="#overview"><Activity/>Overview</a><a href="#decision"><BrainCircuit/>AI risk analysis</a><a href="#executions"><LockKeyhole/>Crypto agility</a><a href="#events"><TriangleAlert/>Security events</a></nav><button className="logout" onClick={onLogout}><LogOut/>Sign out</button></aside><main className="dashboard" id="overview"><header><div><span className="eyebrow">SECURITY CONTROL PLANE</span><h1>Adaptive protection overview</h1><p>Live decisions across AI risk, policy and post-quantum execution.</p></div><button className="refresh" onClick={load}><RefreshCw className={loading ? 'spin' : ''}/>Refresh</button></header>{error && <div className="error">{error}</div>}<section className="cards"><Card icon={<TriangleAlert/>} label="Security events" value={stats.events}/><Card icon={<BrainCircuit/>} label="Adaptive executions" value={stats.runs}/><Card icon={<ShieldCheck/>} label="Verified success" value={`${stats.success}%`}/><Card icon={<Clock3/>} label="Average latency" value={`${stats.latency} ms`}/></section><section className="grid" id="decision"><article className="panel hero"><div><span className={`pill ${latest?.riskLevel?.toLowerCase()}`}>{latest?.riskLevel || 'NO DATA'} RISK</span><h2>{latest?.selectedMode || 'Awaiting execution'}</h2><p>{latest?.algorithmProfile || 'Run the adaptive Bruno request to create a decision.'}</p></div><div className="score"><strong>{latest ? Math.round(latest.riskScore * 100) : 0}%</strong><span>AI risk score</span></div></article><article className="panel"><h3>Latency breakdown</h3>{latest ? <div className="bars"><Bar name="AI + policy" value={latest.policyLatencyMillis} total={latest.totalLatencyMillis}/><Bar name="Cryptography" value={latest.cryptoLatencyMillis} total={latest.totalLatencyMillis}/><Bar name="Total flow" value={latest.totalLatencyMillis} total={latest.totalLatencyMillis}/></div> : <Empty/>}</article></section><ExecutionTable runs={runs}/><EventTable events={events}/></main></div>;
}

function ExecutionTable({runs}) { return <article className="panel table" id="executions"><div className="panel-title"><div><h3>Adaptive crypto executions</h3><p>Auditable policy outcomes and verified cryptographic round trips</p></div><span>{runs.length} records</span></div><div className="execution-grid"><b>Risk</b><b>Mode and profile</b><b>Verification</b><b>Total latency</b>{runs.slice(0, 8).map(run => <React.Fragment key={run.executionId}><span className={`pill ${run.riskLevel?.toLowerCase()}`}>{run.riskLevel}</span><div><strong>{run.selectedMode}</strong><small>{run.algorithmProfile}</small></div><span className={`status ${run.roundTripVerified ? 'success' : 'denied'}`}>{run.roundTripVerified ? 'Verified' : 'Failed'}</span><time>{run.totalLatencyMillis} ms</time></React.Fragment>)}{!runs.length && <Empty/>}</div></article>; }
function EventTable({events}) { return <article className="panel table" id="events"><div className="panel-title"><div><h3>Recent security activity</h3><p>Authentication, access and adaptive protection events</p></div><span>{events.length} records</span></div><div className="rows">{events.slice(0, 10).map(event => <div className="row" key={event.eventId}><span className={`dot ${event.outcome.toLowerCase()}`}/><div><strong>{event.eventType.replaceAll('_', ' ')}</strong><small>{event.sourceService} · {event.username || 'system'}</small></div><code>{event.requestPath}</code><time>{new Date(event.occurredAt).toLocaleString()}</time></div>)}{!events.length && <Empty/>}</div></article>; }
function Card({icon, label, value}) { return <article className="card"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>; }
function Bar({name, value, total}) { return <div className="bar"><div><span>{name}</span><b>{value} ms</b></div><i><em style={{width: `${Math.max(4, value / Math.max(total, 1) * 100)}%`}}/></i></div>; }
function Empty() { return <p className="empty">No records available yet.</p>; }
export function App() { const [token, setToken] = useState(sessionStorage.getItem('pqcToken')); return token ? <Dashboard token={token} onLogout={() => { sessionStorage.removeItem('pqcToken'); setToken(null); }}/> : <Login onLogin={setToken}/>; }

const rootElement = document.getElementById('root');
if (rootElement) createRoot(rootElement).render(<App/>);
