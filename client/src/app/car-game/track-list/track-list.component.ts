import { Component, OnInit, Input } from "@angular/core";
import { TrackService } from "./track.service";
import { Track } from "../../../../../common/interface/track";
import { ActivatedRoute } from "@angular/router";
import { ServerResponse } from "../../../../../common/interface/server-response-interface";
import { TracksResponse } from "../../../../../common/interface/track-response-interface";
import { PreviewService } from "../views/preview/preview.service";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent implements OnInit {
  @Input()
  public isPreviewForPlay: boolean;

  public tracks: Track[];
  public selectedTrack: Track;

  public constructor(
    private trackService: TrackService,
    private route: ActivatedRoute,
    private previewService: PreviewService) {
    this.tracks = [];

  }

  public ngOnInit(): void {
    this.updateTrackList();
    this.selectedTrack = this.tracks[0];
    this.previewService.notifyTrack(this.tracks[0]);
    this.route.data.subscribe((initialCondition) => {
      this.isPreviewForPlay = initialCondition.isPreviewForPlay as boolean;
    });
  }

  public onSelect(track: Track): void {
    this.previewService.notifyTrack(track);
    this.selectedTrack = track;
  }

  public onDelete(track: Track): void {
    this.trackService.deleteTrack(track._id).subscribe((result: ServerResponse) => {
      this.updateTrackList();
    });
  }

  public updateTrackList(): void {
    this.trackService.getTracks().subscribe((result: TracksResponse) => {
      this.tracks = result.tracks as Track[];
    });
  }

  public onPlay(track: Track): void {
    this.trackService.incrementTimesPlayed(track).subscribe((result: ServerResponse) => {});
  }
}
