'use strict';

// include external dependencies
import * as express from "express";
import {Response} from "../restful";
import {BaseRoutes} from "../classes";
import config from "../config";
import {Tasks, Clients} from "../models";

export class Main extends BaseRoutes {
    protected initRoutes() {
        this.baseUri = config.api.baseApiUri;
        this.router.route('/tasks').get(this.getTasks);
        this.router.route('/clients').get(this.getClients);
    }

    private async getTasks(req: express.Request, res: express.Response): Promise<any> {

        const client = req.query.client;

        try {

            const result = await Tasks
                .query()
                .select('ID', 'Description')
                .where({
                    ClientID: client
                });

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR STARTING SESSION: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, `Error fetching tasks for client ${client}`, {
                error: error.toString()
            }))
        }
    }

    private async getClients(req: express.Request, res: express.Response): Promise<any> {

        try {

            const result = await Clients
                .query()
                .eager('[locations, users.[role, location]]');

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR STARTING SESSION: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, `Error fetching clients`, {
                error: error.toString()
            }))
        }
    }

}
