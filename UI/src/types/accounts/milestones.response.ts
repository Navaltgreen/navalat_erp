export interface MileStone {
  id: number;
  created_at: string;
  amount: number;
  comments: string;
}
export type MileStoneHistoryResponse = MileStone[];
