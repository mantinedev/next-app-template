import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { cookies } from 'next/headers';
import { getTokenFromHeader } from '../getTokenHeader/getTokenHeader';
const secretKey = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

export async function GET() {
  let res = await prisma.category.findMany({ where: { status: true } });
  return new Response(JSON.stringify(res));
}

export async function POST(req: any) {
  try {
    const category = await req.json();
    try {
      const token = getTokenFromHeader(req);
      const decoded = jwt.verify(token, secretKey);

      if (decoded) {
        const NewCategory = await prisma.category.create({
          data: {
            name: category.name,
          },
        });
        return new Response(JSON.stringify({ message: 'Başarı İle Kayıt Edildi', NewCategory }), {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 201,
        });
      } else {
        return new Response(
          JSON.stringify({ error: 'Kayıt Hatası', details: 'Yetkiniz bulunmuyor' }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 401,
          }
        );
      }
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Kayıt Hatası', details: error.message }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ message: 'Hata', error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE İŞLEMİ
export async function DELETE(req: any) {
  try {
    const { id } = await req.json();

    const token = getTokenFromHeader(req); // Token'ı header'dan al
    const decoded = jwt.verify(token, secretKey);

    if (decoded) {
      const deletecategory = await prisma.category.update({
        where: { id: id },
        data: {
          status: false,
        },
      });
      return new Response(JSON.stringify({ message: 'Başarı İle Silindi', deletecategory }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 201,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Silme Hatası', details: 'Yetkiniz bulunmuyor' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 401,
        }
      );
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Silme Hatası', details: error.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// UPDATE İŞLEMİ
export async function PUT(req: any) {
  try {
    const { id, name } = await req.json();

    const token = getTokenFromHeader(req); // Token'ı header'dan al
    const decoded = jwt.verify(token, secretKey);

    if (decoded) {
      const updatedCategory = await prisma.category.update({
        where: { id: id },
        data: {
          name: name,
        },
      });
      return new Response(JSON.stringify({ message: 'Başarı İle Güncellendi', updatedCategory }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 201,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Güncelleme Hatası', details: 'Yetkiniz bulunmuyor' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 401,
        }
      );
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Güncelleme Hatası', details: error.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
