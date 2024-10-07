import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const advisor1 = await prisma.advisor.create({
    data: {
      name: "Dr. Alice Johnson",
      registration: "A12345",
    },
  });

  const advisor2 = await prisma.advisor.create({
    data: {
      name: "Dr. Bob Smith",
      registration: "B54321",
    },
  });

  const authors: {
    id: string;
    registration: string;
    name: string;
    advisorId: string;
  }[] = [];
  for (let i = 0; i < 20; i++) {
    const author = await prisma.author.create({
      data: {
        name: `Author ${i + 1}`,
        registration: `R10${i + 1}`,
        advisorId: i % 2 === 0 ? advisor1.id : advisor2.id,
      },
    });
    authors.push(author);
  }

  const thesisTitles = [
    "The Impact of AI on Education",
    "Blockchain and Its Applications",
    "Quantum Computing and Cryptography",
    "The Role of Data Science in Healthcare",
    "Machine Learning Algorithms for Financial Markets",
    "Augmented Reality in Retail",
    "The Future of Autonomous Vehicles",
    "Cybersecurity Challenges in Cloud Computing",
    "Natural Language Processing in Social Media Analysis",
    "IoT and Smart City Applications",
    "Big Data Analytics in E-commerce",
    "The Role of Renewable Energy in Sustainability",
    "Virtual Reality in Gaming",
    "5G Networks and Their Impact on Communication",
    "Ethics in Artificial Intelligence",
    "Deep Learning for Image Recognition",
    "The Evolution of Digital Marketing",
    "Wearable Technology in Healthcare",
    "Genetic Algorithms in Problem Solving",
    "Edge Computing and Its Industrial Applications",
  ];

  for (let i = 0; i < 20; i++) {
    const title = thesisTitles[i % thesisTitles.length];
    const year = 2020 + (i % 5);

    await prisma.thesis.create({
      data: {
        title: `${title} - ${i + 1}`,
        keywords: ["Keyword1", "Keyword2", "Keyword3"],
        fileUrl: `http://example.com/thesis${i + 1}.pdf`,
        abstract: `Abstract of thesis ${i + 1}`,
        year: year,
        authorId: authors[i].id,
      },
    });
  }

  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        registration: "R10001",
        name: "admin",
        password: "password123",
      },
      {
        email: "jane.roe@example.com",
        registration: "R10002",
        name: "Jane Roe",
        password: "password456",
      },
    ],
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
