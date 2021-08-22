import { ComponentFixture, fakeAsync, tick, TestBed, discardPeriodicTasks } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GithubService } from './github.service';
import { instance, mock, verify, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'child'
})
class FakeChildComponent {
  @Input() childName?: string;
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let githubServiceMock: GithubService;
  let makeRequestFake$: Subject<any>;

  beforeEach(async () => {
    githubServiceMock = mock(GithubService);

    makeRequestFake$ = new Subject();

    when(githubServiceMock.makeRequest()).thenReturn(makeRequestFake$);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent,
        FakeChildComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed
      .overrideComponent(AppComponent, {
        set: {
          providers: [{
            provide: GithubService,
            useValue: instance(githubServiceMock)
          }]
        }
      })
      .createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'CodeSandbox'`, () => {
    expect(component.title).toEqual('CodeSandbox');
  });

  it('should render title', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.content span')?.textContent).toContain('CodeSandbox app is running!');
  });

  it('should pass correct name to child', () => {
    const expectedName = 'child name';

    fixture.detectChanges();

    const childComponent = fixture.debugElement
      .query(By.directive(FakeChildComponent))
      .componentInstance;

    expect(childComponent.childName).toBe(expectedName);
  });

  describe('Testing debounce', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.inputFormControl.setValue('123');
    });
    it('should not get data from github immediately after typing something via input', fakeAsync(() => {
      verify(githubServiceMock.makeRequest()).never();

      discardPeriodicTasks();
    }));

    it('should get data from github after 500 ms from last input event', (done) => {
      setTimeout(() => {
        verify(githubServiceMock.makeRequest()).once();
        done();
      }, 500);
    });
  });

});
