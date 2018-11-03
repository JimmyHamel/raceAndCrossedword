/*tslint:disable*/
import { TestBed, inject } from '@angular/core/testing';

import { RoomService } from './room.service';
import { MessengerService } from './messenger.service';
import { SocketService } from './socket.service';
import { InfoService } from './info.service';
import { GameObservableService } from './game-observable.service';
import { Router } from '@angular/router';
import { GridService } from './grid/grid.service';

describe('RoomService', () => {

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomService, MessengerService, SocketService, InfoService, GameObservableService, { provide: Router, useValue: mockRouter }, GridService ]
    });
  });

  it('should be created', inject([RoomService], (service: RoomService) => {
    expect(service).toBeTruthy();
  }));
});
