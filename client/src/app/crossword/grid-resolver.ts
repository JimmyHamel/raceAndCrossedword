import { Injectable } from "@angular/core";
import {
    Resolve,
    ActivatedRouteSnapshot
} from "@angular/router";
import {InfoService} from "./info.service";
import { GridGetterService } from "./grid-getter.service";
import { SINGLEPLAYRER_DIFFICULTY } from "../../../../common/communication/communication-url";

@Injectable()
export class GridResolve implements Resolve<void> {
    public constructor(private gridGetter: GridGetterService, private infoService: InfoService) { }

    public async resolve(route: ActivatedRouteSnapshot): Promise<void> {
        this.infoService.gridDifficulty = route.params[SINGLEPLAYRER_DIFFICULTY];

        return this.gridGetter.getGrid(+route.params[SINGLEPLAYRER_DIFFICULTY]).then((res) => {
            this.infoService.words = res;
            this.infoService.wordCount = [0, 0, this.infoService.words.length];
            this.infoService.createGridFromWords();
        }).catch((e) => {alert(e); });
    }
}
