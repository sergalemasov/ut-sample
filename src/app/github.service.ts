import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GithubService {
  constructor(private httpClient: HttpClient) {}

  public makeRequest() {
    return this.httpClient.get("https://api.github.com/users/defunkt");
  }
}
