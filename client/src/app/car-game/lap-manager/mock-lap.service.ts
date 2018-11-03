import { LapManager } from "./lap-manager";
import { MockLapManager } from "./mock-lap-manager";

export class MockLapService {

    public lapManagers: LapManager[];

    public constructor() {
        this.lapManagers = [];
    }

    public get playerManager(): MockLapManager {
        const manager: MockLapManager = new MockLapManager();
        manager._laps = 0;

        return manager;
    }

}
