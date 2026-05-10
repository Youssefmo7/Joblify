export function timeAgo(dateStr) {
    if (!dateStr) return 'unknown';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (!Number.isFinite(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDateTime(dateStr) {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    if (!Number.isFinite(date.getTime())) return 'Unknown';
    return date.toLocaleString();
}
