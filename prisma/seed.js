const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  console.log('Cleaning up database...');
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.geo.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleaned.');

  // Create users with their related data
  console.log('Seeding new data...');
  const usersData = [
    {
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      password: await bcrypt.hash('password123', 10),
      username: 'Bret',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    },
    {
      name: 'Ervin Howell',
      email: 'Shanna@melissa.tv',
      password: await bcrypt.hash('password123', 10),
      username: 'Antonette',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618',
        },
      },
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains',
      },
    },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const { address, company, ...userFields } = userData;
    // Create user first
    const user = await prisma.user.create({
      data: userFields,
    });
    createdUsers.push(user);

    // Create address with geo
    if (address) {
      const { geo, ...addressFields } = address;
      await prisma.address.create({
        data: {
          ...addressFields,
          userId: user.id,
          geo: {
            create: geo,
          },
        },
      });
    }

    // Create company
    if (company) {
      await prisma.company.create({
        data: {
          ...company,
          userId: user.id,
        },
      });
    }
  }

  // Create posts using dynamic user IDs
  const postsData = [
    {
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
      userId: createdUsers[0].id,
    },
    {
      title: 'qui est esse',
      body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla',
      userId: createdUsers[0].id,
    },
    {
      title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
      body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut',
      userId: createdUsers[1].id,
    },
  ];

  const createdPosts = [];
  for (const post of postsData) {
    const newPost = await prisma.post.create({
      data: post,
    });
    createdPosts.push(newPost);
  }

  // Create comments using dynamic user and post IDs
  const commentsData = [
    {
      name: 'id labore ex et quam laborum',
      email: 'Eliseo@gardner.biz',
      body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium',
      postId: createdPosts[0].id,
      userId: createdUsers[0].id,
    },
    {
      name: 'quo vero reiciendis velit similique earum',
      email: 'Jayne_Kuhic@sydney.com',
      body: 'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et',
      postId: createdPosts[0].id,
      userId: createdUsers[1].id,
    },
    {
      name: 'odio adipisci rerum aut animi',
      email: 'Nikita@garfield.biz',
      body: 'quia molestiae reprehenderit quasi aspernatur aut expedita occaecati aliquam eveniet laudantium omnis quibusdam delectus saepe quia accusamus maiores nam est cum et ducimus et vero voluptates excepturi deleniti ratione',
      postId: createdPosts[1].id,
      userId: createdUsers[0].id,
    },
  ];

  for (const comment of commentsData) {
    await prisma.comment.create({
      data: comment,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 