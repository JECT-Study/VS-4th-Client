export interface VoteResultOption {
  optionId: number;
  label: string;
  voteCount: number;
  ratio: number;
}

export interface InsightUnlocked {
  locked: false;
  scope: "MY_SELECTION" | "TOTAL";
  selectionCount: number;
  genderDistribution: {
    female: { count: number; ratio: number };
    male: { count: number; ratio: number };
  };
  ageDistribution: Array<{ ageGroup: string; ratio: number; isMyGroup: boolean }>;
}

export interface InsightLocked {
  locked: true;
  scope: null;
  selectionCount: null;
  genderDistribution: null;
  ageDistribution: null;
}

export interface VoteResult {
  voteId: number;
  title: string;
  createdAt: string;
  content: string;
  thumbnailUrl: string | null;
  status: "ENDED";
  endAt: string;
  participantCount: number;
  result: { options: VoteResultOption[] };
  myVote: { voted: boolean; selectedOptionId: number | null };
  insight: InsightUnlocked | InsightLocked;
  aiInsight: { available: boolean; headline: string | null; body: string | null };
}
