'use strict';

// include external dependencies
import * as express from "express";
import {Response} from "../restful";
import {BaseRoutes} from "../classes";
import config from "../config";
import {Users} from "../models";

export class UsersRoute extends BaseRoutes {

    protected initRoutes() {
        this.baseUri = config.api.baseApiUri;
        this.router.route('/users').get(this.getUsers);
        this.router.route('/users/:client').get(this.getUsersBelongingToAClient);
        this.router.route('/users/supervisors/all').get(this.getAllSupervisors);

    }

    async getUsersBelongingToAClient(req: express.Request, res: express.Response): Promise<any> {

        const {
            client
        } = req.params;

        try {

            const result = await Users
                .query()
                .eager("[role, location]")
                .where({
                    ClientID: client
                });

            res.send(result);

        }

        catch (error) {
            // this.logger.info(`ERROR FETCHING USERS belonging to supervisor with ID ${supervisor}: `, error);
            res.status(500).send(new Response(500, `ERROR FETCHING USERS belonging to client with ID ${client}: `, {
                error: error.toString()
            }))
        }
    }

    private async getUsers(req: express.Request, res: express.Response): Promise<any> {

        try {

            const result = await Users
                .query()
                .eager("[role, location]");

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR FETCHING USERS:", error);
            res.status(500).send(new Response(500, "Error fetching users", {
                error: error.toString()
            }))
        }
    }

    private async getAllSupervisors(req: express.Request, res: express.Response): Promise<any> {

        try {

            const result = await Users
                .query()
                .joinRelation('role')
                .eager("[role, location]")
                .where('role.Role', 'supervisor');

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR FETCHING USERS:", error);
            res.status(500).send(new Response(500, "Error fetching all supervisors", {
                error: error.toString()
            }))
        }
    }
}
