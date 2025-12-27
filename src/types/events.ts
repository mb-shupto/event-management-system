export interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  capacity?: number;
  registeredCount?: number;
}