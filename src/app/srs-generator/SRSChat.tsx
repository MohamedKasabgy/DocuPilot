'use client';

import { useState } from 'react';
import type { SrsOutput } from '@/lib/ai/schemas/srs';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const priorityColors: Record<string, string> = {
  critical: 'var(--status-danger)',
  high: 'var(--status-warning)',
  medium: 'var(--accent-primary)',
  low: 'var(--text-muted)',
};

const roleIcons = [
  { icon: 'fa-regular fa-user', color: 'var(--status-info)' },
  { icon: 'fa-solid fa-shield-halved', color: 'var(--accent-primary)' },
  { icon: 'fa-solid fa-briefcase-medical', color: 'var(--status-success)' },
  { icon: 'fa-solid fa-user-gear', color: 'var(--status-warning)' },
  { icon: 'fa-solid fa-user-tie', color: 'var(--text-muted)' },
];

export default function SRSChat() {
  const [clientRequest, setClientRequest] = useState('');
  const [srsResult, setSrsResult] = useState<SrsOutput | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [refinementInput, setRefinementInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  async function generateSrs() {
    if (clientRequest.trim().length < 10) {
      setError('Please enter a more detailed request (at least 10 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setChatMessages([]);

    try {
      const res = await fetch('/api/ai/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientRequest }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      setSrsResult(result.data);
      setUsedFallback(result.usedFallback === true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate SRS. Please try again.');
      setUsedFallback(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function refine() {
    if (!refinementInput.trim() || !srsResult) return;

    const userMsg = refinementInput.trim();
    setRefinementInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequest,
          currentSrs: srsResult,
          refinementMessage: userMsg,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Refinement failed');
      }

      setSrsResult(result.data);
      setChatMessages(prev => [...prev, { role: 'ai', content: 'SRS updated based on your feedback.' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed.');
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Failed to refine. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateSrs();
    }
  }

  function handleRefinementKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      refine();
    }
  }

  return (
    <>
      {/* Input Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="text-xs text-muted font-bold"
          style={{ textTransform: 'uppercase', marginBottom: 'var(--spacing-md)' }}>
          Client Request
        </div>
        <div style={{
          background: 'var(--bg-surface)',
          border: 'var(--glass-border)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <textarea
            value={clientRequest}
            onChange={e => setClientRequest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="نحتاج نظام حجوزات للعيادات يشمل موقع للحجز، لوحة تحكم للإدارة...&#10;&#10;Describe your project requirements in Arabic or English..."
            dir={/[؀-ۿ]/.test(clientRequest) ? 'rtl' : 'ltr'}
            style={{
              width: '100%',
              minHeight: '120px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.8',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="text-xs text-accent" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-language"></i>
            {/[؀-ۿ]/.test(clientRequest) ? 'Arabic detected' : 'English'}
          </div>
          <button
            className="btn btn-primary"
            onClick={generateSrs}
            disabled={isLoading || clientRequest.trim().length < 10}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading && !srsResult ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate SRS</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card" style={{
          marginBottom: 'var(--spacing-lg)',
          background: 'rgba(220, 38, 38, 0.05)',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
        }}>
          <i className="fa-solid fa-circle-exclamation text-danger"></i>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Fallback notice */}
      {usedFallback && srsResult && (
        <div className="card" style={{
          marginBottom: 'var(--spacing-lg)',
          background: 'rgba(217, 119, 6, 0.05)',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--status-warning)', flexShrink: 0 }}></i>
          <span className="text-sm">Gemini was temporarily unavailable. A demo SRS has been loaded — results may not reflect your exact input.</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !srsResult && <LoadingSkeleton />}

      {/* SRS Result */}
      {srsResult && <SRSResultCards srs={srsResult} isUpdating={isLoading} />}

      {/* Chat Refinement Panel */}
      {srsResult && (
        <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
          <div className="font-bold" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <i className="fa-solid fa-comments text-accent"></i> Refine SRS
          </div>

          {chatMessages.length > 0 && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              marginBottom: 'var(--spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  background: msg.role === 'user' ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface)',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}>
                  <span className="text-sm">{msg.content}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <input
              type="text"
              value={refinementInput}
              onChange={e => setRefinementInput(e.target.value)}
              onKeyDown={handleRefinementKeyDown}
              placeholder="Add payment integration, simplify roles, change priority..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                border: 'var(--glass-border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={refine}
              disabled={isLoading || !refinementInput.trim()}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function LoadingSkeleton() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-surface-elevated) 50%, var(--bg-surface) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--radius-md)',
  };

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div className="grid" style={{ gap: 'var(--spacing-lg)', gridTemplateColumns: '1fr 400px', marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div style={{ ...shimmer, height: '20px', width: '40%', marginBottom: 'var(--spacing-lg)' }}></div>
          <div style={{ ...shimmer, height: '80px', marginBottom: 'var(--spacing-md)' }}></div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div style={{ ...shimmer, height: '50px', flex: 1 }}></div>
            <div style={{ ...shimmer, height: '50px', flex: 1 }}></div>
            <div style={{ ...shimmer, height: '50px', flex: 1 }}></div>
          </div>
        </div>
        <div className="card">
          <div style={{ ...shimmer, height: '20px', width: '30%', marginBottom: 'var(--spacing-lg)' }}></div>
          <div style={{ ...shimmer, height: '60px', marginBottom: 'var(--spacing-sm)' }}></div>
          <div style={{ ...shimmer, height: '60px', marginBottom: 'var(--spacing-sm)' }}></div>
          <div style={{ ...shimmer, height: '60px' }}></div>
        </div>
      </div>
      <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-lg)' }}>
        <div className="card">
          <div style={{ ...shimmer, height: '20px', width: '35%', marginBottom: 'var(--spacing-lg)' }}></div>
          <div style={{ ...shimmer, height: '40px', marginBottom: 'var(--spacing-sm)' }}></div>
          <div style={{ ...shimmer, height: '40px', marginBottom: 'var(--spacing-sm)' }}></div>
          <div style={{ ...shimmer, height: '40px' }}></div>
        </div>
        <div className="card">
          <div style={{ ...shimmer, height: '20px', width: '45%', marginBottom: 'var(--spacing-lg)' }}></div>
          <div style={{ ...shimmer, height: '60px', marginBottom: 'var(--spacing-sm)' }}></div>
          <div style={{ ...shimmer, height: '60px' }}></div>
        </div>
      </div>
    </>
  );
}

function SRSResultCards({ srs, isUpdating }: { srs: SrsOutput; isUpdating: boolean }) {
  const containerStyle: React.CSSProperties = isUpdating ? { opacity: 0.6, pointerEvents: 'none' } : {};

  return (
    <div style={containerStyle}>
      {/* Confidence Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 'var(--spacing-md)',
      }}>
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-md)',
          borderRadius: 'var(--radius-full)',
          background: srs.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)',
          border: `1px solid ${srs.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <i className={`fa-solid fa-gauge-high ${srs.confidenceScore >= 80 ? 'text-success' : 'text-warning'}`}></i>
          <span className="text-xs font-bold">Confidence: {srs.confidenceScore}%</span>
        </div>
      </div>

      {/* Project Brief + User Roles */}
      <div className="grid" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', gridTemplateColumns: '1fr 400px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-regular fa-file-lines text-accent"></i> Project Brief
          </div>
          <h3 className="font-bold" style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.1rem' }}>
            {srs.projectBrief.projectName}
          </h3>
          {srs.projectBrief.clientName && (
            <div className="text-xs text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
              Client: {srs.projectBrief.clientName}
            </div>
          )}
          <p className="text-sm" style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            {srs.projectBrief.summary}
          </p>
          <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-md)', marginTop: 'auto' }}>
            <MetaChip label="Complexity" value={srs.projectBrief.complexity} />
            <MetaChip label="Industry" value={srs.projectBrief.industry} />
            <MetaChip label="Infrastructure" value="Cloud SaaS" />
          </div>
        </div>

        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-users text-warning"></i> User Roles
          </div>
          <div className="list-group">
            {srs.userRoles.map((role, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface-elevated)',
                border: 'var(--glass-border)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                alignItems: 'center',
              }}>
                <div style={{ color: roleIcons[i % roleIcons.length].color }}>
                  <i className={roleIcons[i % roleIcons.length].icon}></i>
                </div>
                <div>
                  <div className="font-bold text-sm">{role.role}</div>
                  <div className="text-xs text-muted">{role.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features + Functional Requirements */}
      <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-regular fa-square-check text-success"></i> Main Features
          </div>
          <div className="list-group">
            {srs.mainFeatures.map((feat, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div>
                  <span className="text-sm font-bold">{feat.title.toUpperCase()}</span>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{feat.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className="text-xs font-bold" style={{ color: priorityColors[feat.priority] }}>
                    {feat.priority.toUpperCase()}
                  </span>
                  <i className="fa-solid fa-check-circle text-success"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-list-check" style={{ color: 'var(--status-info)' }}></i> Functional Requirements
          </div>
          <div className="list-group" style={{ gap: 'var(--spacing-lg)' }}>
            {srs.functionalRequirements.map((fr) => (
              <div key={fr.id} style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                <div className="text-xs font-bold text-muted" style={{ width: '40px', marginTop: '2px' }}>{fr.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="text-sm font-bold">{fr.title}</div>
                    <span className="text-xs font-bold" style={{ color: priorityColors[fr.priority] }}>
                      {fr.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted" style={{ fontStyle: 'italic', marginTop: '4px' }}>{fr.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Non-Functional Requirements + Missing Questions */}
      <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-shield-halved text-accent"></i> Non-Functional Requirements
          </div>
          <div className="list-group">
            {srs.nonFunctionalRequirements.map((nfr, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface-elevated)',
                border: 'var(--glass-border)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div className="text-xs font-bold text-accent" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>
                  {nfr.category}
                </div>
                <div className="text-sm">{nfr.requirement}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-md)' }}>
            <i className="fa-solid fa-question text-accent"
              style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px' }}></i>
            AI Identified Gaps
          </div>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Missing information required for a high-fidelity SRS:
          </p>
          <div className="list-group section-mb">
            {srs.missingQuestions.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-accent" style={{ marginTop: '4px' }}></i>
                <div className="text-sm">{q}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'auto', border: '1px solid var(--border-strong)' }}>
            REQUEST CLARIFICATIONS FROM CLIENT
          </button>
        </div>
      </div>

      {/* MVP Scope + Assumptions */}
      <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-rocket text-accent"></i> MVP Scope
          </div>
          <div style={{
            position: 'relative',
            paddingLeft: '20px',
            borderLeft: '2px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xl)',
            marginLeft: '8px',
            marginTop: 'var(--spacing-md)',
          }}>
            {srs.mvpScope.map((item, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-25px',
                  top: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--accent-primary)' : 'var(--border-strong)',
                  boxShadow: i === 0 ? '0 0 8px var(--accent-primary-glow)' : 'none',
                }}></div>
                <div className="text-sm font-bold" style={{ marginBottom: '4px' }}>Phase {i + 1}</div>
                <div className="text-xs text-muted">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-lightbulb text-warning"></i> Assumptions
          </div>
          <div className="list-group">
            {srs.assumptions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-circle-check text-muted" style={{ marginTop: '4px', fontSize: '0.7rem' }}></i>
                <div className="text-sm">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card" style={{
        background: 'rgba(79, 70, 229, 0.05)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-xl)',
      }}>
        <div>
          <h2 className="text-display font-bold" style={{ marginBottom: '8px', fontSize: '1.5rem' }}>
            Ready to finalize?
          </h2>
          <p className="text-sm text-muted">
            The AI has analyzed your request and structured the initial scope.<br />
            You can now push this to the Contracts module or refine the requirements further.
          </p>
        </div>
        <div style={{ fontSize: '4rem', opacity: 0.1, color: 'var(--accent-primary)', pointerEvents: 'none' }}>
          <i className="fa-solid fa-file-contract"></i>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface-elevated)',
      padding: 'var(--spacing-md)',
      borderRadius: 'var(--radius-md)',
      border: 'var(--glass-border)',
    }}>
      <div className="text-xs text-muted font-bold" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div className="text-sm font-bold" style={{ textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}
