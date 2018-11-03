import { Component, ViewChild, ElementRef, HostListener, OnInit } from "@angular/core";
import { TimeFormat } from "../../lap-manager/time-format";
import { RenderService } from "../../render-service/render.service";
import { TrackService } from "../../track-list/track.service";
import { IS_EDITOR, IS_PREVIEW } from "../../constants";
import { PreviewService } from "./preview.service";
import { Track } from "../../../../../../common/interface/track";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
  providers: [RenderService],
})
export class PreviewComponent implements OnInit {

  public track: Track;

  @ViewChild("container")
  private containerRef: ElementRef;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public constructor(private renderService: RenderService,
                     private trackService: TrackService,
                     public previewService: PreviewService) {
    this.previewService.getTrack().subscribe((trackInput: Track) => {
      this.track = trackInput;
      this.loadTrack();
    });
  }

  public ngOnInit(): void {

    this.track = this.trackService.tracks[0];
    this.loadTrack();
    this.renderService
      .initialize(this.containerRef.nativeElement, !IS_EDITOR, IS_PREVIEW)
      .then(/* do nothing */)
      .catch((err) => console.error(err));
  }

  private loadTrack(): void {
    this.trackService.getTrack(this.track._id)
      .subscribe((serverResponse) => {
        this.renderService.loadTrack(serverResponse.track.points, serverResponse.track.type);
      });
  }

  public formatTime(num: number): string {
    return TimeFormat.csToString(num);
  }

}
