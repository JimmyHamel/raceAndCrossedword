import "reflect-metadata";
import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { LexicalService } from "./lexical-service/lexical-service";
import { RouterTrack } from "./routers/router-track";
import { TrackService } from "./track-service/track-service";
import { RouterApi } from "./routers/router-api";
import { RouterLexical } from "./routers/router-lexical";
import { ServiceGrid } from "./grid-service/grid-service";
import { RouterGrid } from "./routers/router-grid";
import { ServiceMultiplayer } from "./multiplayer-service/multiplayer-service";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.LexicalService).to(LexicalService);
container.bind(Types.ServiceGrid).to(ServiceGrid);
container.bind(Types.ServiceMultiplayer).to(ServiceMultiplayer);
container.bind(Types.RouterGrid).to(RouterGrid);
container.bind(Types.TrackService).to(TrackService);
container.bind(Types.RouterApi).to(RouterApi);
container.bind(Types.RouterTrack).to(RouterTrack);
container.bind(Types.RouterLexical).to(RouterLexical);

export { container };
