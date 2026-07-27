import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardList({
  users = [],
  currentUserId,
}) {
  if (users.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <LeaderboardRow
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUserId}
        />
      ))}
    </div>
  );
}