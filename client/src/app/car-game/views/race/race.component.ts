import { Component, OnInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { RenderService } from "../../render-service/render.service";
import { TrackCountdownService } from "../../countdown/track-countdown.service";
import { LoadTrackService } from "../load-track.service";
import { IS_EDITOR, IS_PREVIEW } from "../../constants";
import { TrackService } from "../../track-list/track.service";
import { Track } from "../../../../../../common/interface/track";

@Component({
  selector: "app-race",
  templateUrl: "./race.component.html",
  styleUrls: ["./race.component.css"],
  providers: [RenderService],
})
export class RaceComponent implements OnInit {
  @ViewChild("container")
  private containerRef: ElementRef;
  private track: Track;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public constructor(
    private renderService: RenderService,
    private countDownService: TrackCountdownService,
    private loadTrackService: LoadTrackService,
    private trackService: TrackService) {

    this.loadTrack();
    this.countDownService.initialize();
  }

  public ngOnInit(): void {
    this.countDownService.countdownObservable.subscribe((countdownValue) => {
      this.renderService.updateCountdownState(countdownValue === 0);
    });

    this.renderService
      .initialize(this.containerRef.nativeElement, !IS_EDITOR, !IS_PREVIEW)
      .then(/* do nothing */)
      .catch((err) => console.error(err));
  }

  private loadTrack(): void {
    if (this.loadTrackService.getIDFromURL()) {
      this.trackService.getTrack(this.loadTrackService.getIDFromURL())
        .subscribe((serverResponse) => {
          this.track = serverResponse.track;
          this.renderService.loadTrack(this.track.points, this.track.type);
        });
    }
  }
  public roundSpeed(num: number): number {
    return Math.round(num);
  }
}
