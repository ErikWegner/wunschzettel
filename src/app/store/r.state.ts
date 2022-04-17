export type ReservationStatus =
  | 'unknown'
  | 'requestPending'
  | 'reserved'
  | 'free'
  | 'updateFailed';

export interface ReservationState {
  itemid: number | null;
  status: ReservationStatus;
  errorText: string | null;
}
