export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  ticketTiers: TicketTier[];
}

export interface TicketTier {
  name: string;
  price: number;
  total: number;
  sold: number;
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};