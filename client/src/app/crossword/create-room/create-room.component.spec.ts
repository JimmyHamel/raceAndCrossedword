/*tslint:disable*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomComponent } from './create-room.component';
import { PlayerService } from '../player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';
import { MessengerService } from '../messenger.service';
import { SocketService } from '../socket.service';
import { InfoService } from '../info.service';
import { GameObservableService } from '../game-observable.service';
import { GridService } from '../grid/grid.service';

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let fixture: ComponentFixture<CreateRoomComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockActivatedRoute = {
    snapshot: { data: {  } }
  } as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoomComponent ],
      providers: [ RoomService, PlayerService, MessengerService, SocketService, InfoService, GameObservableService, {provide: ActivatedRoute, useValue: mockActivatedRoute}, { provide: Router, useValue: mockRouter }, GridService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
