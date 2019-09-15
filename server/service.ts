"use strict";
import * as express from 'express';
import * as cors from 'cors';
import * as fs from 'fs';
import * as moment from 'moment';
import * as Knex from 'knex';
import * as winston from "winston";
const bodyParser = require("body-parser");
import knexConfig from './knexfile';
const appRoot = require('app-root-path');

import config from "./config";

import {Main, HealthCheckRoutes, UsersRoute, SessionRoute} from "./routes";

export class TemplateService {
    private logger: any = winston;
    private winston: any;

    private app: any; // express server
    private envReady: boolean = false;

    public knex: any;
    public Model: any = require('objection').Model;

    constructor() {
        this.knex = Knex(knexConfig);
        this.Model.knex(this.knex);
    }

    //main start function
    public start() {
        console.log('DATABASE URL:',  { DBCONFIG: config.db });

        this.initEnv().then(() => {
            if (this.envReady) {
                this.initWinston();

                //start internal services before starting sub-modules
                TemplateService.initServices().then(() => {
                    this.startSubModules();

                    //start the express server(s)
                    this.initExpress();

                }, err => {
                    this.logger.error("Error in main ()", {
                        err: err
                    });
                });
            } else {
                this.logger.error("Env did not ready up");
            }
        });
    }

    //setup the log folder and any other environment needs
    private initEnv(): Promise<void> {
        return new Promise<void>((resolve) => {
            let logDir: string = config.serviceSettings.logsDir;
            fs.stat(logDir, (err) => {
                if (!!err)
                    fs.mkdir(logDir, () => {
                        this.envReady = true;
                        resolve();
                    });
                else {
                    this.envReady = true;
                    resolve();
                }
            });
        });
    }

    private initWinston() {
        console.log("INITIATING WINSTON");
        //winston is configured as a private variable to the main app.ts
        //it can then be spread to child modules or routeModules. This way only one winston object needs to be setup

        const myFormat = winston.format.printf(({ timestamp, level, message, meta }) => {
            return `${timestamp}: ${level.toUpperCase()}: ${message}: ${meta ? JSON.stringify(meta) : ''}`;
        });

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.splat(),
                myFormat,
                ),
            exitOnError: false,
            transports: [
                new this.logger.transports.File({
                    level: 'info',
                    filename: `${appRoot}/logs/service.log`,
                    handleExceptions: true,
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                    colorize: true,
                }),
                new this.logger.transports.Console({
                    colorize: true,
                    showLevel: true,
                    timestamp: true,
                    level: "debug",
                })
            ]
        });

        this.logger.info('Winston has been init');
    }

    private initExpress() {

        console.log("INITIATING EXPRESS SERVER");
        //create express
        this.app = express();
        // this.initCORS();
        this.app.use(cors());
        //make express use the bodyParser for json middleware, and expressValidator for validation middleware
        this.app.use(bodyParser.json({}));
        // this.app.use(expressValidator());

        //health check
        let healthCheckRoutes: HealthCheckRoutes = new HealthCheckRoutes(this.logger);
        this.app.use("/", healthCheckRoutes.getRoutes());

        //todo add a security layer here, such as JWT

        //add in any routes you might want
        this.initAppRoutes();

        //and start!
        console.log("STARTING EXPRESS SERVER");
        this.app.listen(config.api.port);
        this.logger.info("Express started @ " + moment().format("HH:mm:ss Do MMMM YYYY") + " (http://localhost:" + config.api.port + "/)");
    }

    private initCORS() {
        //todo: optional, configure better cors
        // let corsOptions = {
        //     origin: (origin, callback) => {
        //         let originIsWhitelisted: boolean = config.api.corsWhitelist.indexOf(origin) !== -1;
        //         callback(null, originIsWhitelisted);
        //     }
        // };

        this.app.use(cors());
    }

    private initAppRoutes() {
        this.app.get('/', (req, res) => {
            res.send("A blank request? Good one...");
        });

        console.log(`BASE API URI: ${config.api.baseApiUri}`);

        //todo: add your routes here
        let mainRoutes: Main = new Main(this.logger);
        let usersRoutes: UsersRoute = new UsersRoute(this.logger);
        let sessionRoutes: SessionRoute = new SessionRoute(this.logger);
        this.app.use(config.api.baseApiUri, mainRoutes.getRoutes());
        this.app.use(config.api.baseApiUri, usersRoutes.getRoutes());
        this.app.use(config.api.baseApiUri, sessionRoutes.getRoutes());

        this.logger.info(`\n\nROUTES:`, {usersRoutes: usersRoutes.router});

        this.logger.info("Express running on http://localhost:" + config.api.port);
    }

    private static initServices(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            //if you have any SDKs that need to be init, do so here
            resolve(true);
        });
    }

    private startSubModules() {
        //todo: register sub-modules here -> use these to run tasks on the side. Keep it light, remember the JS Event loop
    }
}

let templateService: TemplateService = new TemplateService();
templateService.start();