'use strict';

// include external dependencies
import * as express from "express";
import { raw } from 'objection';
import {Response} from "../restful";
import {BaseRoutes} from "../classes";
import config from "../config";
import {Session} from "../models";

export class SessionRoute extends BaseRoutes {
    protected initRoutes() {
        this.baseUri = config.api.baseApiUri;

        this.router.route('/session/start').post(this.startSession);
        this.router.route('/session/update/:id').post(this.updateSession);
        this.router.route('/session/all/:id').get(this.getSessions);
        this.router.route('/session/:id').get(this.getSession);
    }

    private async startSession(req: express.Request, res: express.Response): Promise<any> {

        try {

            const session = req.body;

            const result = await Session.query().insertAndFetch(session);

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR STARTING SESSION: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, "Error starting session", {
                error: error.toString()
            }))
        }
    }

    private async updateSession(req: express.Request, res: express.Response): Promise<any> {

        try {

            const sessionId = req.params.id;
            const valuesToUpdate = req.body;

            await Session.query().updateAndFetchById(sessionId, valuesToUpdate);

            const session = await Session
                .query()
                .eager('[location]')
                .joinRelation('operator')
                .joinRelation('task')
                .joinRelation('supervisor')
                .select('Session.*', 'task.Description as TaskDescription', 'operator.FirstName as FirstName')
                .select(raw(`operator."FirstName" || ' ' || operator."LastName" as "OperatorName"`))
                .select(raw(`supervisor."FirstName" || ' ' || supervisor."LastName" as "SupervisorName"`))
                .where('Session.ID', sessionId)
                .first();

            res.send({
                ...session,
                LocationName: session.location && session.location.Name ? session.location.Name : 'Not Selected',
            });

        }

        catch (error) {
            // this.logger.info("ERROR STARTING SESSION: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, "Error starting session", {
                error: error.toString()
            }))
        }
    }

    private async getSessions(req: express.Request, res: express.Response): Promise<any> {

        const {
            id,
        } = req.params;

        try {

            let result = await Session
                .query()
                .eager('[location]')
                .joinRelation('operator')
                .joinRelation('task')
                .joinRelation('supervisor')
                .select('Session.*', 'task.Description as TaskDescription', 'operator.FirstName as FirstName')
                .select(raw(`operator."FirstName" || ' ' || operator."LastName" as "OperatorName"`))
                .select(raw(`supervisor."FirstName" || ' ' || supervisor."LastName" as "SupervisorName"`))
                .where('Session.ClientID', id)
                .orderBy('Session.CreatedAt', 'DESC');

            result = result.map(r => {
                return {
                    ...r,
                    LocationName: r.location && r.location.Name ? r.location.Name : 'Not Selected'
                }
            });

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR GETTING SESSIONS: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, `Error retrieving sessions for supervisor with ID ${id}`, {
                error: error.toString()
            }))
        }
    }

    private async getSession(req: express.Request, res: express.Response): Promise<any> {

        const {
            id,
        } = req.params;

        try {

            const result = await Session
                .query()
                .joinRelation('operator')
                .joinRelation('task')
                .select('Session.*', 'task.Description as TaskDescription', 'operator.FirstName as FirstName')
                .select(raw(`operator."FirstName" || ' ' || operator."LastName" as "OperatorName"`))
                .where('Session.ID', id)
                .first();

            res.send(result);

        }

        catch (error) {
            // this.logger.info("ERROR GETTING SESSIONS: "+ JSON.stringify(error, null, 4));
            res.status(500).send(new Response(500, `Error retrieving session`, {
                error: error.toString()
            }))
        }
    }
}
