import { DayVisitor } from "./time-visitor/day-visitor";
import { NightVisitor } from "./time-visitor/night-visitor";
import { Visitor } from "./time-visitor/visitor";
import { Element } from "./time-visitor/element";

export class NightManager {
    private isDay: boolean;
    private elements: Element[];
    private dayVisitor: DayVisitor;
    private nightVisitor: NightVisitor;

    public constructor(isADayTrack: boolean) {
        this.isDay = isADayTrack;
        this.elements = [];
        this.dayVisitor = new DayVisitor();
        this.nightVisitor = new NightVisitor();
    }

    public initElements(): void {
        this.visitElements(this.isDay ? this.dayVisitor : this.nightVisitor);
    }

    public changeTime(): void {
        this.isDay = !this.isDay;
        this.visitElements(this.isDay ? this.dayVisitor : this.nightVisitor);
    }

    public addElement(newElement: Element): void {
        this.elements.push(newElement);
    }

    private visitElements(visitor: Visitor): void {
        for (const element of this.elements) {
            element.accept( visitor);
        }
    }
}
