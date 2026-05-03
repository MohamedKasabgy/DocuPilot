import React from 'react';
import Card from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'info' | 'danger';
  iconBgColor?: string;
  iconColor?: string;
}

export default function MetricCard({ title, value, icon, badgeText, badgeType, iconBgColor, iconColor }: MetricCardProps) {
  return (
    <Card className="stat-card">
      <div className="card-header">
        <div
          className="list-item-icon"
          style={{ background: iconBgColor, color: iconColor }}
        >
          <i className={icon}></i>
        </div>
        <span className={`badge badge-${badgeType}`}>{badgeText}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </Card>
  );
}
