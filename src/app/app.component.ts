import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GithubService } from './github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [GithubService]
})
export class AppComponent {
  constructor(private githubService: GithubService) {}

  title = "CodeSandbox";
  response: any;
  childName?: string;

  inputFormControl = new FormControl('');

  ngOnInit() {
    this.setChildName();
    this.setupControlChanges();
  }

  private setChildName() {
    this.childName = 'child name';
  }

  private makeGithubRequest() {
    return this.githubService.makeRequest();
  }

  private setupControlChanges() {
    this.inputFormControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(() => this.makeGithubRequest())
      )
      .subscribe(() => {});
  }
}
