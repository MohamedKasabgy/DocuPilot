import Header from '@/components/layout/Header';
import SRSChat from './SRSChat';

export default function SRSGeneratorPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">
        <div className="page-header" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="text-xs font-bold text-accent"
              style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>AI Laboratory</div>
            <h1 className="page-title">Smart SRS Generator</h1>
            <p className="page-subtitle">Transform raw client requests into professional Software Requirements Specifications.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button className="btn btn-secondary">Save Draft</button>
            <button className="btn btn-primary">Export PDF</button>
          </div>
        </div>

        <SRSChat />
      </div>
    </>
  );
}
