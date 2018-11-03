import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from "@angular/core";
import { RenderService } from "../../../render-service/render.service";
import { IS_EDITOR, IS_PREVIEW } from "../../../constants";
import { LoadTrackService } from "../../load-track.service";
import { Track } from "../../../../../../../common/interface/track";
import { TrackService } from "../../../track-list/track.service";
import { Point } from "../../../track-editor/point";
import { SaveablePoint } from "../../../../../../../common/interface/saveable-point-interface";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"],
  providers: [RenderService],
})
export class EditorComponent implements AfterViewInit {

  @ViewChild("container")
  private containerRef: ElementRef;

  private trackNameInput: string;
  private trackDescriptionInput: string;
  public isSaveable: Boolean;
  private track: Track;
  private hasIllegalLines: boolean;
  private isTrackCompleted: boolean;
  private type: string;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public constructor(
    private renderService: RenderService,
    private loadTrackService: LoadTrackService,
    private trackService: TrackService) {
    this.type = "jour";
    this.loadTrack();
  }

  public ngAfterViewInit(): void {
    this.renderService
      .initialize(this.containerRef.nativeElement, IS_EDITOR, !IS_PREVIEW)
      .then(/* do nothing */)
      .catch((err) => console.error(err));
    this.renderService.illegalLinesObserver.subscribe((illegalLines) => {
      this.hasIllegalLines = illegalLines.length > 0;
      this.updateSaveableState();
    });

    this.renderService.trackCompletedObserver.subscribe((isTrackCompleted) => {
      this.isTrackCompleted = isTrackCompleted;
      this.updateSaveableState();
    });
  }

  private loadTrack(): void {
    const id: string = this.loadTrackService.getIDFromURL();
    if (id) {
      this.trackService.getTrack(id)
        .subscribe((serverResponse) => {
          this.track = serverResponse.track;
          this.trackNameInput = this.track.name;
          this.trackDescriptionInput = this.track.description;
          this.type = this.track.type;
          this.renderService.loadTrack(this.track.points);
        });
    } else {
      this.track = {
        name: "",
      };
    }
  }

  private updateSaveableState(): void {
    this.isSaveable = (!this.hasIllegalLines && this.isTrackCompleted);
  }

  public onSave(): void {
    if (!this.isSameName()) {
      this.saveNewTrack();
    } else {
      this.updateTrack();
    }
  }

  private saveNewTrack(): void {
    const trackToSave: Track = this.createTrackFromEditor();
    this.trackService.saveTrack(trackToSave).subscribe((response) => {
      this.track = trackToSave;
      this.updateID(response.message);
      alert(response.message.split("with")[0]);
    });
  }

  private updateTrack(): void {
    this.track.description = this.trackDescriptionInput;
    this.track.type = this.type;
    this.track.points = this.getConvertedPoints();
    this.trackService.updateTrack(this.track).subscribe((response) => {
      alert(response.message);
    });
  }

  private createTrackFromEditor(): Track {
    return {
      description: this.trackDescriptionInput,
      name: this.trackNameInput,
      points: this.getConvertedPoints(),
      type: this.type,
    };
  }

  private getConvertedPoints(): SaveablePoint[] {
    const trackPoints: Point[] = this.renderService.saveTrack();
    const saveableTrackPoints: SaveablePoint[] = [];
    trackPoints.forEach((point) => {
      saveableTrackPoints.push({
        x: point.positionX,
        z: point.positionZ,
      });
    });
    saveableTrackPoints.push({
      x: trackPoints[0].positionX,
      z: trackPoints[0].positionZ,
    });

    return saveableTrackPoints;
  }

  private isSameName(): boolean {
    return this.track.name === this.trackNameInput;
  }

  private updateID(serverMessage: string): void {
    this.track._id = serverMessage.split("=")[1];
  }
}
