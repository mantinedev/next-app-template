'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const prisma = new PrismaClient();

export async function POST(req: any) {
  try {
    const { email, password } = await req.json();
    var user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Böyle Bir Kullanıcı Bulunmamakta' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    //PAROLA HASHLEME
    //     const hashedPassword = await bcrypt.hash('can1', 10);
    // console.log('Yeni oluşturulan hash:', hashedPassword);
    
    const passwordmatch = await bcrypt.compare(password, user.password);
    if (passwordmatch) {
      const payload = {
        user: user,
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      return new Response(
        JSON.stringify({
          message: 'Giriş Başarılı',
          user,
          token,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'Şifrenizi Kontrol Ediniz',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: { error },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
