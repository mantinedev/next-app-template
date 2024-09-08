export function getTokenFromHeader(req: any) {
              const authHeader = req.headers.get('Authorization');
              console.log(req.headers);
              if (!authHeader || !authHeader.startsWith('Bearer')) {
                throw new Error('Token sağlanmadı'+authHeader);
              }
              return authHeader.split(' ')[1]; // Bearer kelimesinden sonraki token'ı al
            }