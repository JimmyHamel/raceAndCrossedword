import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { MessengerService } from "./messenger.service";

@Injectable()
export class GameObservableService {
    private selectedWord: Subject<number>;
    private completedWord: Subject<number>;
    private outsideClick: Subject<boolean>;
    private secondPlayerSelectedWord: Subject<number>;
    private secondPlayerCompletedWord: Subject<number>;

    public constructor(private messengerService: MessengerService) {
        this.selectedWord = new Subject<number>();
        this.completedWord = new Subject<number>();
        this.outsideClick = new Subject<boolean>();
        this.secondPlayerSelectedWord = new Subject<number>();
        this.secondPlayerCompletedWord = new Subject<number>();
    }

    public notifyIndexSelectedWord(index: number): void {
        this.selectedWord.next(index);
        this.messengerService.emitSelectedWord(index);
    }

    public getIndexSelectedWord(): Observable<number> {
        return this.selectedWord.asObservable();
    }

    public notifyIndexSecondPlayerSelectedWord(index: number): void {
        this.secondPlayerSelectedWord.next(index);
    }
    public getIndexSecondPlayerSelectedWord(): Observable<number> {
        return this.secondPlayerSelectedWord.asObservable();
    }

    public notifyIndexSecondPlayerCompletedWord(index: number): void {
        this.secondPlayerCompletedWord.next(index);
    }
    public getIndexSecondPlayerCompletedWord(): Observable<number> {
        return this.secondPlayerCompletedWord.asObservable();
    }

    public notifyIndexCompletedWord(index: number): void {
        this.completedWord.next(index);
        this.messengerService.emitCompletedWord(index);
    }
    public getIndexCompletedWord(): Observable<number> {
        return this.completedWord.asObservable();
    }

    public notifyOutsideClick(outClick: boolean): void {
        this.outsideClick.next(outClick);
    }
    public getOutsideClick(): Observable<boolean> {
        return this.outsideClick.asObservable();
    }
}
