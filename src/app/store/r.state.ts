export type ReservationStatus =
  | 'unknown'
  | 'requestPending'
  | 'reserved'
  | 'free';

export interface ReservationState {
  itemid: number | null;
  status: ReservationStatus;
}
