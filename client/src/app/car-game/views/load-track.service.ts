import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class LoadTrackService {

  public constructor(
    private activatedRoute: ActivatedRoute) { }

  public getIDFromURL(): string {
    return this.activatedRoute.snapshot.queryParams["id"];
  }
}
