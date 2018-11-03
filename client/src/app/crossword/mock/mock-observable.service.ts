import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class MockObservableService {

    private numberSubject: Subject<number>;
    private booleanSubject: Subject<boolean>;
    private secondPlayerSelectedWord: Subject<number>;

    public constructor() {
        this.numberSubject = new Subject<number>();
        this.booleanSubject = new Subject<boolean>();
        this.secondPlayerSelectedWord = new Subject<number>();
    }

    public getIndexSelectedWord(): Observable<number> {
        return this.numberSubject.asObservable();
    }
    public getIndexSecondPlayerSelectedWord(): Observable<number> {
        return this.secondPlayerSelectedWord.asObservable();
    }
    public getIndexSecondPlayerCompletedWord(): Observable<number> {
        return this.numberSubject.asObservable();
    }
    public getIndexCompletedWord(): Observable<number> {
        return this.numberSubject.asObservable();
    }
    public getOutsideClick(): Observable<boolean> {
        return this.booleanSubject.asObservable();
    }
    public notifyIndexSecondPlayerSelectedWord(index: number): void {
        this.secondPlayerSelectedWord.next(index);
    }
}
