import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router";

export default interface Routes {
    path: string,
    component: FunctionComponent<RouteComponentProps>
}