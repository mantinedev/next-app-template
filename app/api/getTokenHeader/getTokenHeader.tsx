export function getTokenFromHeader(req: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization başlığı eksik.');
  }
  if (!authHeader.startsWith('Bearer ')) { // Boşluk eklemek "Bearer" sonrası boşluk olması gerektiğini garanti altına alır
    throw new Error('Authorization başlığı "Bearer" ile başlamalıdır.');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Token sağlanmadı.');
  }
  return token;
}
