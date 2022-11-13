import express, { Application, Request, Response } from "express";

const app: Application = express();

const PORT: number = 8000;

app.route('/health')
  .get((req: Request, res: Response) => {
    console.log('checking health');

    return res.send('All OK!');
  })

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));