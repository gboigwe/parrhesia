import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DebateActionsProps {
  debateId: string;
  status: string;
  isParticipant: boolean;
  canJoin: boolean;
  onJoin?: () => void;
  isJoining?: boolean;
}

export function DebateActions({
  debateId,
  status,
  isParticipant,
  canJoin,
  onJoin,
  isJoining = false,
}: DebateActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Join Button */}
      {canJoin && onJoin && (
        <Button
          onClick={onJoin}
          disabled={isJoining}
          variant="primary"
          size="lg"
          className="flex-1 sm:flex-none"
        >
          {isJoining ? "Joining..." : "Join Debate"}
        </Button>
      )}

      {/* Vote Button */}
      {status === "voting" && (
        <Link href={`/debates/${debateId}/vote`}>
          <Button variant="primary" size="lg">
            Cast Your Vote
          </Button>
        </Link>
      )}

      {/* Results Button */}
      {status === "completed" && (
        <Link href={`/debates/${debateId}/results`}>
          <Button variant="outline" size="lg">
            View Results
          </Button>
        </Link>
      )}

      {/* Back to Debates */}
      <Link href="/debates">
        <Button variant="ghost" size="lg">
          ← Back to Debates
        </Button>
      </Link>
    </div>
  );
}
