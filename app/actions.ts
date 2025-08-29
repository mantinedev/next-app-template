'use server';

const dummyPayments: Payment[] = [
  {
    id: 1,
    date: '2025-05-05',
    owner: 'me',
    title: 'Bolletta luce',
    type: 'utilities',
    amount: 100,
    participants: [
      { userId: 'me', percentage: 50, paid: true },
      { userId: 'alice', percentage: 50, paid: false },
    ],
  },
  {
    id: 2,
    date: '2025-05-10',
    owner: 'alice',
    title: 'Spesa',
    type: 'groceries',
    amount: 80,
    participants: [
      { userId: 'me', percentage: 50, paid: false },
      { userId: 'alice', percentage: 50, paid: true },
    ],
  },
  {
    id: 3,
    date: '2025-06-01',
    owner: 'me',
    title: 'Netflix',
    type: 'entertainment',
    amount: 20,
    participants: [
      { userId: 'me', percentage: 50, paid: true },
      { userId: 'bob', percentage: 50, paid: true },
    ],
  },
];

export async function fetchUserStats(userId: string, period: Date) {
  const month = period.getMonth();
  const year = period.getFullYear();

  const filtered = dummyPayments.filter((p) => {
    const d = new Date(p.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  let paid = 0;
  let toPay = 0;
  let toReceive = 0;
  let received = 0;

  for (const payment of filtered) {
    for (const participant of payment.participants) {
      const share = (payment.amount * participant.percentage) / 100;

      // Se sono io
      if (participant.userId === userId) {
        if (participant.paid) {
          paid += share;
        } else {
          toPay += share;
        }
      }

      // Se sono l'owner
      if (payment.owner === userId && participant.userId !== userId) {
        if (participant.paid) {
          received += share;
        } else {
          toReceive += share;
        }
      }
    }
  }

  return { paid, toPay, toReceive, received };
}
