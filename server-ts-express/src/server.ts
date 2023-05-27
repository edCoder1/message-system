import express, { Application, Request, Response } from "express";
import axios, { AxiosError } from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { IncomingHttpHeaders } from "http";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT: string = process.env.TS_SERVER_PORT || '8001';

const prisma: PrismaClient = new PrismaClient();

// configs
app.use(cors({
  origin: process.env.CLIENT_URL
}));

// routes
app.route('/health')
  .get((req: Request, res: Response) => {
    console.log('checking health');

    return res.send('All OK!');
  });

app.route('/posts')
  .get(async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany({ select: {
        id: true,
        title: true
      }});

      // define a response interface
      // define a helper function to handle promises
      return res.status(Status.OK)
        .json({
          status: Status.OK,
          message: 'Success',
          data: {
            posts
          }
        });
      
    } catch (error) {
      console.error({ error });
      return res.status(Status.SERVER_ERROR)
        .json({ 
          status: Status.SERVER_ERROR,
          message: 'Error',
          error
        });
    }
  })
  .post(async (req: Request, res: Response) => {

    const { title, body } = req.body;

    // create a helper function to handle errors
    if (!(title && body)) {
     return res
      .status(Status.CLIENT_ERROR)
      .json({
        status: 'Error',
        message: 'Missing Post title or body'
      });
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          body
        }
      });

      // define a response interface
      return res
        .status(Status.CREATED)
        .json({
          status: Status.OK,
          message: 'Post successfuly created'
        });
      // is there a better way to ty[e this ?]
    } catch (error: any) {
      console.error({ error });
      return res
        .status(Status.SERVER_ERROR)
        .json({ 
          status: 'Error',
          message: 'Internal server error',
          debugError: error.message
        });
    }
  });
  
app.route('/posts/:id')
  .get((req:Request, res: Response) => {

    const { id } = req.params;
    
    console.log({ id });
    
    // create a helper function to handle errors
    if (!id) {
     return res
      .status(Status.CLIENT_ERROR)
      .json({
        status: 'Error',
        message: 'Missing Post id'
      });
    }

    try {
      const post = prisma.post.findUnique({
        where: { id },
        select: {
          body: true,
          title: true,
          comments: {
            select: {
              id: true,
              message: true,
              parentId: true,
              createdAt: true,
              user: {
               select: {
                id: true,
                name: true
               } 
              }
            }
          }
        }
      });

      // define a response interface
      return res
      .status(Status.OK)
      .json({
        status: Status.OK,
        message: 'Success',
        data: {
          posts: [post]
        }
      });
    } catch (error) {
      
    }


  });

app.route('/users')
  .get(async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();

      // define a response interface
      // define a helper function to handle promises
      return res.status(Status.OK)
        .json({
          status: Status.OK,
          message: 'Success',
          data: {
            users
          }
        });
      
    } catch (error) {
      console.error({ error });
      return res.status(Status.SERVER_ERROR)
        .json({ 
          status: Status.SERVER_ERROR,
          message: 'Error',
          error
        });
    }
  });

// properly organize this
enum Status {
  SERVER_ERROR  = 500,
  CLIENT_ERROR  = 400,
  OK            = 200,
  CREATED       = 201
}

// needed ?
interface AxiosReqConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: object,
  headers?: IncomingHttpHeaders
}

// need db specific handling.. not http request
const handleRequest = async ({
  method,
  url,
  data: body,
  headers
}: AxiosReqConfig) => {

  try {
    const { data } = await axios({
      method,
      url,
      data: body,
      headers
    });

    return 
    
  } catch (error) {
    
  }


}



app.listen(PORT, () => console.log(`server started on port: ${PORT}`));