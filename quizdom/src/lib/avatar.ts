// Helper function to generate consistent color from name
const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "from-purple-700 to-pink-600",
    "from-blue-600 to-cyan-500",
    "from-green-600 to-emerald-500",
    "from-orange-600 to-red-500",
    "from-indigo-600 to-purple-500",
    "from-rose-600 to-pink-500",
    "from-teal-600 to-green-500",
    "from-amber-600 to-orange-500",
    "from-violet-600 to-fuchsia-500",
    "from-sky-600 to-blue-500",
  ];

  return colors[Math.abs(hash) % colors.length];
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  // First, extract only the part before the first opening parenthesis
  const nameBeforeParentheses = name.split("(")[0].trim();

  const parts = nameBeforeParentheses
    .split(" ")
    .filter((part) => part.length > 0);

  if (parts.length === 0) return "??";

  if (parts.length === 1) {
    // Single name: take first 2 characters
    return parts[0].substring(0, 2).toUpperCase();
  }

  if (parts.length === 2) {
    // Two names: take first letter of each
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Three or more names: take first letter of first, middle, and last
  return (
    parts[0][0] +
    parts[Math.floor(parts.length / 2)][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
};

export { getAvatarColor, getInitials };
