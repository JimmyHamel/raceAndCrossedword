import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { NgGridModule } from "angular2-grid";
import { AppComponent } from "./app.component";
import { GridComponent } from "./crossword/grid/component/grid.component";
import { CluesComponent } from "./crossword/clues/clues.component";
import { ViewsComponent } from "./crossword/views/views.component";
import { StatsPanelComponent } from "./crossword/stats-panel/stats-panel.component";
import { GameSelectorComponent } from "./game-selector/game-selector.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LobbyComponent } from "./crossword/lobby/lobby.component";
import { CreateRoomComponent } from "./crossword/create-room/create-room.component";
import { WaitingConnectionComponent } from "./crossword/waiting-connection/waiting-connection.component";
import { WaitingGridComponent } from "./crossword/waiting-grid/waiting-grid.component";
import { InfoService } from "./crossword/info.service";
import { GridGetterService } from "./crossword/grid-getter.service";
import { SocketService } from "./crossword/socket.service";
import { RoomService } from "./crossword/room.service";
import { MessengerService } from "./crossword/messenger.service";
import { PlayerService } from "./crossword/player.service";
import { GameObservableService } from "./crossword/game-observable.service";
import { GridService } from "./crossword/grid/grid.service";
import { InitializeService } from "./crossword/grid/initializer.service";
import * as Url from "../../../common/communication/communication-url";
import { APP_BASE_HREF } from "@angular/common";
import { EditorcomponentDirective } from "./car-game/views/editor/editorcomponent.directive";
import { CollisionService } from "./car-game/collision/collision.service";
import { InputVerificatorDirective } from "./crossword/grid/inputVerificatorDirective";
import { GridResolve } from "./crossword/grid-resolver";
import { AdminComponent } from "./car-game/admin/admin.component";
import { TrackListComponent } from "./car-game/track-list/track-list.component";
import { TrackService } from "./car-game/track-list/track.service";
import { ResultScreenComponent } from "./crossword/result-screen/result-screen.component";
import { TrackCountdownComponent } from "./car-game/countdown/track-countdown.component";
import { TrackCountdownService } from "./car-game/countdown/track-countdown.service";
import { FormsModule } from "@angular/forms";
import { LapPanelComponent } from "./car-game/lap-panel/lap-panel.component";
import { LapCounterService } from "./car-game/lap-manager/lap-counter.service";
import { LapService } from "./car-game/lap-manager/lap.service";
import { EndGameComponent } from "./car-game/end-game/end-game.component";
import { EndGameService } from "./car-game/end-game/end-game.service";
import { RaceComponent } from "./car-game/views/race/race.component";
import { EditorComponent } from "./car-game/views/editor/component/editor.component";
import { PreviewComponent } from "./car-game/views/preview/preview.component";
import { LoadTrackService } from "./car-game/views/load-track.service";
import { ControlsPanelComponent } from "./car-game/controls-panel/controls-panel.component";
import { HighscoreService } from "./car-game/end-game/highscore.service";
import { AboutComponent } from "./about/about.component";
import { PreviewService } from "./car-game/views/preview/preview.service";

const appRoutes: Routes = [
    {
        path: Url.HOME_URL.replace(/[/]/, ""),
        component: GameSelectorComponent,
    },
    {
        path: Url.ABOUT_URL,
        component: AboutComponent,
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.singleplayer + ":" + Url.SINGLEPLAYRER_DIFFICULTY,
        component: ViewsComponent,
        resolve: {
            grid: GridResolve
        },
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.CROSSWORD_LOBBY_URL,
        component: LobbyComponent,
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.CROSSWORD_NEWROOM_URL,
        component: CreateRoomComponent,
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.WAITING_CONNECTION_URL,
        component: WaitingConnectionComponent,
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.LOADING_GAME_URL,
        component: WaitingGridComponent,
    },
    {
        path: Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.MULTIPLAYER_BOARD_URL,
        component: ViewsComponent,
    },
    {
        path: Url.CROSSWORD_BOARD_URL + Url.CROSSWORD_VICTORY,
        component: ResultScreenComponent,
    },
    {
        path: Url.ADMIN_URL,
        component: AdminComponent,
    },
    {
        path: Url.HOME_URL + Url.LIST_URL,
        component: TrackListComponent, data: { isPreviewForPlay: true },
    },
    {
        path: Url.PLAY_URL,
        component: RaceComponent
    },
    {
        path: Url.HOME_URL + Url.ADMIN_URL,
        component: AdminComponent,
    },
    {
        path: Url.EDIT_URL,
        component: EditorComponent,
    },
    {
        path: Url.END_GAME_URL,
        component: EndGameComponent,
    },
    {
        path: "",
        redirectTo: "/" + Url.HOME_URL.replace(/[/]/, ""),
        pathMatch: "full"
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        GameSelectorComponent,
        GridComponent,
        CluesComponent,
        ViewsComponent,
        PageNotFoundComponent,
        StatsPanelComponent,
        EditorcomponentDirective,
        LobbyComponent,
        CreateRoomComponent,
        WaitingConnectionComponent,
        InputVerificatorDirective,
        WaitingGridComponent,
        AdminComponent,
        TrackListComponent,
        ResultScreenComponent,
        TrackCountdownComponent,
        LapPanelComponent,
        EndGameComponent,
        RaceComponent,
        EditorComponent,
        PreviewComponent,
        ControlsPanelComponent,
        AboutComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        RouterModule.forRoot(appRoutes, { enableTracing: false }),
        NgGridModule,
        FormsModule,
    ],
    providers: [
        InfoService,
        TrackService,
        GridGetterService,
        GridResolve,
        SocketService,
        RoomService,
        MessengerService,
        PlayerService,
        GameObservableService,
        GridService,
        InitializeService,
        CollisionService,
        TrackCountdownService,
        { provide: APP_BASE_HREF, useValue: "/" },
        LapService,
        LapCounterService,
        EndGameService,
        LoadTrackService,
        HighscoreService,
        PreviewService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
