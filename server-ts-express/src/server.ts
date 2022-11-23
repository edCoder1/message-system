import express, { Application, Request, Response } from "express";
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT: string = process.env.TS_SERVER_PORT || '8001';

const prisma: PrismaClient = new PrismaClient();

app.route('/health')
  .get((req: Request, res: Response) => {
    console.log('checking health');

    return res.send('All OK!');
  });

app.route('/posts')
  .get(async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany();

      // define a response interface
      // define a helper function to handle promises
      return res.json({ posts });
      
    } catch (error) {
      console.error({ error });
      return res.json({ error });
    }
  })
  .post(async (req: Request, res: Response) => {
    try {
      console.log('posting...');
      
      // harcoded for now
      const post = await prisma.post.create({
        data: {
          title: 'POST-0',
          body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, assumenda?'
        }
      });

      // define a response interface
      // define a helper function to handle promises
      return res.status(201).send('OK');
      
    } catch (error) {
      console.error({ error });
      return res.json({ error });
    }
  });


app.listen(PORT, () => console.log(`server started on port: ${PORT}`));