import express, { NextFunction, Request, Response } from 'express';
const server = express();
import https from 'https';
import cors from 'cors';
import { env } from './env';
import { readFileSync } from 'fs';
import { lstat, readdir } from 'fs/promises';
import prisma from './lib/prisma';
import { ZodError, ZodSchema } from 'zod';

export type RESTHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void> | any | Promise<any>;

export interface RESTRoute {
  path: string;
  method: RESTMethods;
  run: RESTHandler;
  needsAuth?: boolean;
  schema?: ZodSchema;
}
export enum RESTMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided' });
  }
  const user = await prisma.user.findUnique({
    where: {
      apiKey,
    },
  });
  if (!user) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  req.user = user;
  next();
};

const validateSchema =
  (schema: ZodSchema | undefined) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schema) {
      const result = schema.safeParse(req.body);
      if (result.success) {
        next();
        return;
      } else {
        const errors = result.error.errors.map((error) => ({
          message: error.message,
        }));
        return res.status(400).json({
          error: 'Invalid request body',
          details: errors,
        });
      }
    }
    next();
  };

/** @type {import('./Helpers/Databases')} */
const importAllHandlers = async (path: string, failedImports: string[]) => {
  await Promise.all(
    (
      await readdir(path)
    ).map(async (file) => {
      console.log(`Importing ${file}`);
      if ((await lstat(`${path}/${file}`)).isDirectory()) {
        console.log(`Importing Folder ${path}/${file}`);
        return await importAllHandlers(`${path}/${file}`, failedImports);
      }
      if (!file.endsWith('.ts') && !file.endsWith('.js')) {
        return;
      }
      import(`${path}/${file}`)
        .then((module) => {
          console.log(`${file} imported`);
          const handler = module.default as RESTRoute;
          if (!handler) {
            return failedImports.push(`${file} is not a REST handler`);
          }
          console.log(
            `Route loaded: ${handler.method.toUpperCase()} ${handler.path}`,
          );
          if (handler.needsAuth) {
            server[handler.method](
              handler.path,
              verifyApiKey,
              validateSchema(handler.schema),
              async (req, res, next) => {
                handler.run(req as Request, res as Response, next);
              },
            );
          } else {
            server[handler.method](
              handler.path,
              validateSchema(handler.schema),
              async (req, res, next) => {
                handler.run(req as Request, res as Response, next);
              },
            );
          }

          console.log(`Loaded ${file}`);
        })
        .catch((err) => {
          console.error(`Failed to import ${file}`);
          console.error(err);
          failedImports.push(`${file} failed to import`);
        });
    }),
  );
};

server.use(
  cors({
    exposedHeaders: ['filename', 'updatedat'],
    maxAge: 1209600,
  }),
);

server.use(express.json({ limit: '100mb' }));
const failedImports = [] as string[];
importAllHandlers(`${__dirname}/RESTAPI`, failedImports).then(() => {
  console.log('Loaded all handlers');
  console.log(`${failedImports.length} handlers failed to load`, failedImports);
});
//Import all REST Endpoints

if (env?.webserver) {
  const httpsServer = https.createServer(
    {
      //@ts-ignore
      key: readFileSync(env.webserver?.keyPath),
      //@ts-ignore
      cert: readFileSync(env.webserver?.certPath),
    },
    server,
  );
} else {
  console.log(`HTTP Server running on port ${env.port}`);
  server.listen(env.port);
}

process.on('unhandledRejection', (reason, p) => {
  console.trace('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
