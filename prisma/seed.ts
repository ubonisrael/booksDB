import { faker } from "@faker-js/faker";
import { prisma } from "../db/client";

// const fakeUserData = Array.from({ length: 100 }).map(() => ({
//   firstName: faker.person.firstName(),
//   lastName: faker.person.lastName(),
//   username: faker.internet.userName(),
//   email: faker.internet.email(),
//   avatar: faker.image.avatar(),
//   password: faker.internet.password(),
// }));

const fakeAuthorData = Array.from({ length: 1000 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  bio: faker.person.bio(),
  avatar: faker.image.avatar(),
  works: {
    create: Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.sentence(),
      summary: faker.lorem.paragraph(),
      imgUrl: faker.image.avatar(),
      pageNumber: faker.number.int({ max: 300 }),
      rating: faker.number.float({ min: 0.0, max: 10.0, fractionDigits: 2 }),
    })),
  },
}));

async function main() {
  for (let i = 0; i < fakeAuthorData.length; i++) {
    const author = await prisma.author.create({
      data: fakeAuthorData[i],
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
