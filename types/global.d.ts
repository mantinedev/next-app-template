// global.d.ts

export {}; // Necessario per rendere il file un modulo

declare global {
  type Participant = {
    userId: string;
    percentage: number;
    paid: boolean;
  };

  type Payment = {
    id: number;
    date: string; // ISO string
    owner: string;
    title: string;
    type: string;
    amount: number;
    participants: Participant[];
  };
}
