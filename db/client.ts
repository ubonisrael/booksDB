import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const updateBookRating = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      reviews: true,
    },
  });
  
  if (book) {
    const newRating =
      book.reviews.reduce((acc, b) => acc + b.vote, 0) / book.reviews.length;
    await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        rating: newRating,
      },
    });
  }
};
