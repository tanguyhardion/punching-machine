export const formatScore = (value) => new Intl.NumberFormat('en-US').format(value)

export const formatTime = (value) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
