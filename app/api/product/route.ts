import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

export async function GET() {
  let res = await prisma.product.findMany();
  return new Response(JSON.stringify(res));
}

export async function POST(req:any) {
  try {
    const post = await req.json();
    try {
      const NewProduct = await prisma.product.create({
        data: {
          name: post.name,
          price: post.price,
          descrip: post.descrip,
          image: post.image,
        },
      });
      return new Response(JSON.stringify({ message: 'Başarı İle Kayıt Edildi', NewProduct }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 201,
      });
    } catch (error:any) {
      return new Response(JSON.stringify({ error: 'Kayıt Hatası', details: error.message }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
  } catch (error:any) {
    return new Response(JSON.stringify({ message: 'Hata Sebebi', error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

//DELETE İŞLEMİ
export async function DELETE(req:any) {
  try {
    const { id } = await req.json();
    const deletepost = await prisma.product.delete({
      where: { id: id },
    });
    return new Response(JSON.stringify({ message: 'Başarı İle Silindi', deletepost }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

//UPDATE İŞLEMİ
export async function PUT(req:any) {
  try {
    const post = await req.json();
    const updatedPost = await prisma.product.update({
      where: { id: post.id },
      data: {
        name: post.name,
        price: post.price,
        descrip: post.descrip,
        image: post.image,
      },
    });
    return new Response(JSON.stringify({ message: 'Başarı İle Güncellendi', updatedPost }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
