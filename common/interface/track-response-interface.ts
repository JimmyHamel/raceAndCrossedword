import { Track } from "./track";
export interface TrackResponse {
    status: number ;
    track: Track;
  }

 export interface TracksResponse {
    status: number;
    tracks: Track[];
 }
