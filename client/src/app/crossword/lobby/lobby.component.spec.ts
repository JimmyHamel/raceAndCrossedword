/*tslint:disable*/
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Room } from '../../../../../common/interface/room-interface';
import { LobbyComponent } from './lobby.component';
import { RoomService } from '../room.service';
import { MessengerService } from '../messenger.service';
import { SocketService } from '../socket.service';
import { InfoService } from '../info.service';
import { GameObservableService } from '../game-observable.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../player.service';
import { GridService } from '../grid/grid.service';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  const mockActivatedRoute = {
    snapshot: { data: {  } }
  } as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyComponent ],
      providers: [ RoomService, MessengerService, SocketService, InfoService, GameObservableService, PlayerService, {provide: ActivatedRoute, useValue: mockActivatedRoute}, { provide: Router, useValue: mockRouter }, GridService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a list of rooms', () => {
    inject([RoomService], (service: RoomService) => {
      expect(isRoom(component.roomService.rooms()[0])).toBe(true);
    });
  });

  let isRoom: (room: Room) => boolean = (room: Room) => {
    return(room).name !== undefined;
  }
});
