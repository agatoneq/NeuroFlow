import React from 'react';
import './StatsPanel.css';

function StatsPanel({ stats }) {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="stats-panel card">
      <h3 className="card-title">📊 Statistics</h3>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{formatTime(stats.totalFocusTime)}</div>
            <div className="stat-label">Focus Time</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🍅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pomodorosCompleted}</div>
            <div className="stat-label">Completed Pomodoros</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageFocus}%</div>
            <div className="stat-label">Average Focus</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.pomodorosCompleted > 0
                ? Math.round(stats.totalFocusTime / stats.pomodorosCompleted)
                : 0}
              m
            </div>
            <div className="stat-label">Avg Session Length</div>
          </div>
        </div>
      </div>

      <div className="daily-goal">
        <div className="goal-header">
          <span>Daily Goal</span>
          <span className="goal-progress-text">
            {stats.pomodorosCompleted}/8 🍅
          </span>
        </div>
        <div className="goal-bar">
          <div
            className="goal-fill"
            style={{ width: `${Math.min((stats.pomodorosCompleted / 8) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="achievements">
        <div className="achievement-title">🏆 Achievements</div>
        <div className="achievement-list">
          {stats.pomodorosCompleted >= 1 && (
            <div className="achievement">✅ First Pomodoro</div>
          )}
          {stats.pomodorosCompleted >= 4 && (
            <div className="achievement">🔥 4 Sessions in a Row</div>
          )}
          {stats.totalFocusTime >= 60 && (
            <div className="achievement">⭐ One Hour of Focus</div>
          )}
          {stats.averageFocus >= 80 && (
            <div className="achievement">🎯 Focus Master</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
