
export interface Calculation {
  id: number;
  expression: string;
  result: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  created_at: string;
  started_at: string;
  finished_at: string;
}
