import { Comment, Post, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const edwin = await prisma.user.create({ data: { name: "Edwin" } })
  const brandon = await prisma.user.create({ data: { name: "Brandon" } })

  const post1: Post = await prisma.post.create({
    data: {
      body: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam tempore quis ducimus eos! Odit, cumque repellendus! Esse praesentium accusamus eaque impedit, illo aliquam porro cupiditate numquam quae explicabo, officiis ratione.',
      title: 'Post1'
    }
  });

  const post2: Post = await prisma.post.create({
    data: {
      body: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam tempore quis ducimus eos! Odit, cumque repellendus! Esse praesentium accusamus eaque impedit, illo aliquam porro cupiditate numquam quae explicabo, officiis ratione.',
      title: 'Post2'
    }
  });

  const comment1: Comment = await prisma.comment.create({
    data: {
      message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi, architecto ab quos ullam tempore voluptates minima voluptatibus voluptatem laudantium provident.',
      userId: edwin.id,
      postId: post1.id
    }
  });

  // child comment
  const comment2: Comment = await prisma.comment.create({
    data: {
      commentId: comment1.id,
      message: 'nested commment: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi, architecto ab quos ullam tempore voluptates minima voluptatibus voluptatem laudantium provident.',
      userId: brandon.id,
      postId: post1.id,
    }
  });

  const comment3: Comment = await prisma.comment.create({
    data: {
      message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi, architecto ab quos ullam tempore voluptates minima voluptatibus voluptatem laudantium provident.',
      userId: brandon.id,
      postId: post1.id
    }
  });

}