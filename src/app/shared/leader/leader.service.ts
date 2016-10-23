import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

import { LeaderModel } from './leader.model';

/**
 * This class provides the Leader service with methods to create, read, update and delete models.
 */
@Injectable()
export class LeaderService {

  private apiUrl = '/leader-api/';

  /**
   * The array of models provided by the service.
   * @type {Array}
   */
  private models;

  /**
   * Contains the currently pending request.
   * @type {Observable<string[]>}
   */
  private request;

  /**
   * Creates a new LeaderService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Creates the Leader.
   * @param {LeaderModel} model - The Leader to create.
   */
  createLeader(model: LeaderModel): Observable<Response> {
    var body: string = model.toString();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl, body, options)
        .map(res => res.json())
  }

  /**
   * Get all models from DB
   * Returns an Observable for the HTTP GET request.
   * If there was a previous successful request
   * (the local models array is defined and has elements), the cached version is returned
   * @return {string[]} The Observable for the HTTP request.
   */
  getLeaders(modelId: string = ''): Observable<Response> {
    if (this.models && this.models.length) {
      return Observable.from([this.models]);
    }

    if (!this.request) {
      this.request = this.http.get(this.apiUrl + modelId)
        .map((res:Response) => {
          this.models = res.json()

          // if (this.models.forEach) {
          //   this.models.forEach((leader) => {
          //     leader = new LeaderModel();
          //     leader.parseData(res);
          //   })
          // }
          // else {
          //   let leader = new LeaderModel();
          //   leader.parseData(res);
          // }

          // console.log('Leaders loaded, response: ', this.models)
          return this.models
        })
    }
    return this.request;
  }

  /**
   * Get a model from DB or from cache.
   */
  getLeader(modelId: string): Observable<Response> {
    return this.getLeaders(modelId)
  }

  /**
   * Updates a model by performing a request with PUT HTTP method.
   * @param LeaderModel A Leader to update
   */
  updateLeader(model:LeaderModel):Observable<Response> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + model._id, model.toString(), {headers: headers})
        .map(res => res.json())
        .catch(this.handleError)
  }

  /**
   * Deletes a model by performing a request with DELETE HTTP method.
   * @param LeaderModel A Leader to delete
   */
  deleteLeader(model:LeaderModel) {
    this.http.delete(this.apiUrl + model._id)
        .map(res => console.log('Leader deleted:', res.json()))
        .catch(this.handleError)
        .subscribe((res) => {});
  }

  get(): Observable<Response> {
    return this.getLeaders()
  }

  private handleError(error: Response) {
      console.error("Error occured:", error);
      return Observable.throw(error.json().error || 'Server error');
  }
}