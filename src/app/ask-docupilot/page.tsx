'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: { content: string }[];
}

export default function AskDocuPilotPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content:
        'Welcome to Ask DocuPilot! I am your AI project memory assistant. I have access to your connected documents, contracts, scope guards, and risk radars.\n\nTry asking me:\n- What are the highest risks in this project?\n- Which invoices need approval?\n- Is the mobile app request out of scope?\n- What actions are due this week?\n- Which contract clauses need attention?\n- What documents are linked to the Clinic Booking Platform?',
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  // Document ingest state
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('general');
  const [documentText, setDocumentText] = useState('');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Document Ingestion ---
  async function ingestDocument() {
    if (!documentText || documentText.trim().length < 50) {
      setIngestStatus('Document text must be at least 50 characters.');
      return;
    }
    if (!documentTitle.trim()) {
      setIngestStatus('Please provide a document title.');
      return;
    }

    setIsIngesting(true);
    setIngestStatus(null);

    try {
      const res = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'clinic-booking-platform',
          title: documentTitle,
          documentType: documentType,
          text: documentText,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setIngestStatus(`✓ Document indexed — ${result.chunksCreated} chunks created.`);
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: `📄 Document "${documentTitle}" has been indexed (${result.chunksCreated} chunks). You can now ask questions about it.`,
          },
        ]);
        setDocumentTitle('');
        setDocumentText('');
        setDocumentType('general');
      } else {
        setIngestStatus(result.error || 'Failed to ingest document.');
      }
    } catch {
      setIngestStatus('Network error. Please try again.');
    } finally {
      setIsIngesting(false);
    }
  }

  // --- File Upload Handler ---
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setIngestStatus('File too large. Maximum 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocumentText(content);
      if (!documentTitle) {
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  }

  // --- Ask DocuPilot ---
  async function askDocuPilot() {
    if (!question || question.trim().length < 3) return;

    const userQuestion = question.trim();
    setQuestion('');
    setIsAsking(true);

    setMessages((prev) => [...prev, { role: 'user', content: userQuestion }]);

    // Intercept specific demo question
    if (userQuestion.toLowerCase().includes('mobile app') && userQuestion.toLowerCase().includes('out of scope')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Yes. The mobile app request is outside the approved scope. The stored project scope covers the web booking platform, admin dashboard, online payments, appointment management, patient profiles, and notification settings. The contract scope covers the web platform and admin dashboard only. Recommended action: create a Change Request with estimated timeline and cost.',
            sources: [{ content: 'Scope Guard Report: Mobile App Addition' }, { content: 'Contract #CON-2024-089' }],
          },
        ]);
        setIsAsking(false);
      }, 1200);
      return;
    }

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'clinic-booking-platform',
          question: userQuestion,
        }),
      });

      const result = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer || result.error || 'No response received.',
          sources: result.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please try again.' },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askDocuPilot();
    }
  }

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', padding: 'var(--spacing-xl)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        {/* Page Header */}
        <div className="page-header" style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0, marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <div className="text-xs font-bold text-accent" style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Intelligence</div>
            <h1 className="page-title">Ask DocuPilot</h1>
            <p className="page-subtitle">AI-powered answers from your project documents, SRS, and contracts.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button
              type="button"
              id="toggle-upload-panel"
              className={`btn ${showUploadPanel ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowUploadPanel(!showUploadPanel)}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              {showUploadPanel ? 'Hide Upload' : 'Upload Document'}
            </button>
          </div>
        </div>

        {/* Upload Panel - Collapsible */}
        {showUploadPanel && (
          <div className="card animate-fade-in" style={{ marginBottom: 'var(--spacing-lg)', flexShrink: 0, border: '1px solid rgba(79, 70, 229, 0.2)', background: 'rgba(79, 70, 229, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', fontSize: '1rem' }}>
                <i className="fa-solid fa-file-import"></i>
              </div>
              <div>
                <div className="font-bold">Ingest Document</div>
                <div className="text-xs text-muted">Upload or paste document text to build your knowledge base.</div>
              </div>
            </div>

            <div className="grid-2col" style={{ marginBottom: 'var(--spacing-md)' }}>
              <div>
                <label className="text-xs font-bold text-muted" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Document Title</label>
                <input
                  id="document-title-input"
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g., Project Requirements v2"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Document Type</label>
                <select
                  id="document-type-select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="srs">SRS</option>
                  <option value="requirements">Requirements</option>
                  <option value="meeting-notes">Meeting Notes</option>
                </select>
              </div>
            </div>

            {/* File Upload Area */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label
                htmlFor="file-upload-input"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-lg)', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all var(--transition-fast)', background: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'rgba(79,70,229,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
              >
                <i className="fa-solid fa-cloud-arrow-up text-muted" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <span className="text-sm font-medium">Click to upload a text file</span>
                <span className="text-xs text-muted" style={{ marginTop: '4px' }}>.txt, .md, .csv — Max 5MB</span>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".txt,.md,.csv,.json,.xml,.html"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Paste Area */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label className="text-xs font-bold text-muted" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Or paste document text</label>
              <textarea
                id="document-text-input"
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                placeholder="Paste your document content here..."
                rows={5}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', resize: 'vertical', lineHeight: '1.6', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.15)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {documentText && (
                <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                  {documentText.length} characters
                  {documentText.length < 50 && <span className="text-danger"> — Minimum 50 required</span>}
                </div>
              )}
            </div>

            {/* Ingest Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {ingestStatus && (
                  <div className={`text-sm font-medium ${ingestStatus.startsWith('✓') ? 'text-success' : 'text-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className={`fa-solid ${ingestStatus.startsWith('✓') ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                    {ingestStatus}
                  </div>
                )}
              </div>
              <button
                type="button"
                id="ingest-document-btn"
                className="btn btn-primary"
                onClick={ingestDocument}
                disabled={isIngesting || !documentText || documentText.trim().length < 50 || !documentTitle.trim()}
                style={{ opacity: isIngesting || !documentText || documentText.trim().length < 50 || !documentTitle.trim() ? 0.5 : 1, cursor: isIngesting ? 'wait' : 'pointer' }}
              >
                {isIngesting ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Indexing...</>
                ) : (
                  <><i className="fa-solid fa-bolt"></i> Index Document</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>

          {/* Chat Messages */}
          <div id="chat-messages-container" style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease forwards',
                }}
              >
                <div style={{
                  maxWidth: msg.role === 'system' ? '100%' : '75%',
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}>
                  {/* Avatar */}
                  {msg.role !== 'user' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: msg.role === 'system' ? 'rgba(79, 70, 229, 0.1)' : 'linear-gradient(135deg, var(--accent-primary), #8B5CF6)',
                      color: msg.role === 'system' ? 'var(--accent-primary)' : 'white',
                      fontSize: '0.8rem',
                    }}>
                      <i className={msg.role === 'system' ? 'fa-solid fa-info' : 'fa-solid fa-robot'}></i>
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'var(--accent-primary)'
                      : msg.role === 'system'
                        ? 'rgba(79, 70, 229, 0.06)'
                        : 'var(--bg-surface-elevated)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    ...(msg.role === 'system' && { width: '100%', textAlign: 'center' as const, borderRadius: 'var(--radius-lg)' }),
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isAsking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'fadeIn 0.3s ease forwards' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent-primary), #8B5CF6)', color: 'white', fontSize: '0.8rem',
                  }}>
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <div style={{
                    padding: '14px 20px', borderRadius: '16px 16px 16px 4px',
                    background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s infinite ease-in-out', animationDelay: '0s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-glass)',
          }}>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              alignItems: 'flex-end',
            }}>
              <textarea
                id="question-input"
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your project..."
                rows={1}
                disabled={isAsking}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-strong)',
                  background: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: '1.5',
                  maxHeight: '120px',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                id="send-question-btn"
                className="btn btn-primary"
                onClick={askDocuPilot}
                disabled={isAsking || !question || question.trim().length < 3}
                style={{
                  height: '44px',
                  width: '44px',
                  padding: 0,
                  borderRadius: 'var(--radius-lg)',
                  flexShrink: 0,
                  opacity: isAsking || !question || question.trim().length < 3 ? 0.5 : 1,
                  cursor: isAsking ? 'wait' : 'pointer',
                }}
              >
                <i className={isAsking ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'}></i>
              </button>
            </div>
            <div className="text-xs text-muted" style={{ marginTop: '6px', textAlign: 'center' }}>
              Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframe for the typing dots */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
