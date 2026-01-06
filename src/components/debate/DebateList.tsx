import { DebateCard } from "./DebateCard";

interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: string;
  format: string;
  status: string;
  stakeAmount: string;
  createdAt: Date;
  creator: {
    basename: string;
  };
  challenger?: {
    basename: string;
  } | null;
}

interface DebateListProps {
  debates: Debate[];
}

export function DebateList({ debates }: DebateListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {debates.map((debate) => (
        <DebateCard key={debate.id} debate={debate} />
      ))}
    </div>
  );
}
