const AVATAR_TONES = [
  'bg-brand-100 text-brand-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
];

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function getTone(name = '') {
  const sum = name.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

export default function Avatar({ name, size = 'md', className = '' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${SIZES[size]} ${getTone(
        name
      )} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}