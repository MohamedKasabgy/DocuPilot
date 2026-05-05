import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'info' | 'danger';
  iconBgColor?: string;
  iconColor?: string;
  trend?: string;
  trendDir?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({
  title,
  value,
  icon,
  badgeText,
  badgeType,
  iconBgColor,
  iconColor,
  trend,
  trendDir = 'neutral',
}: MetricCardProps) {
  const trendIcon =
    trendDir === 'up' ? 'fa-solid fa-arrow-trend-up' :
    trendDir === 'down' ? 'fa-solid fa-arrow-trend-down' :
    'fa-solid fa-minus';

  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: iconBgColor ?? 'var(--bg-surface-elevated)', color: iconColor ?? 'var(--accent-primary)' }}>
          <i className={icon}></i>
        </div>
        <span className={`badge badge-${badgeType}`}>{badgeText}</span>
      </div>

      <div className="stat-value tabular-nums">{value}</div>
      <div className="stat-label">{title}</div>

      {trend && (
        <div className={`stat-trend ${trendDir}`}>
          <i className={trendIcon}></i>
          {trend}
        </div>
      )}
    </div>
  );
}
