import * as express from "express";
import {Response} from "../restful";
import {BaseRoutes} from "../classes";
import config from "../config";

export class HealthCheckRoutes extends BaseRoutes {
    protected initRoutes() {
        this.baseUri = config.api.healthCheck;

        this.router.route(this.baseUri).get((req, res) => this.doHealthCheck(req, res));
    }

    private doHealthCheck(req: express.Request, res: express.Response) {
        let promise: Promise<Response> = new Promise<Response>((resolve) => {
            resolve(new Response(200, "Healthy", {
                healthy: true
            }));
        });

        this.completeRequest(promise, res);
    }
}