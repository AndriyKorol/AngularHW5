import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.api_url;
  private editTask: BehaviorSubject<Post> = new BehaviorSubject({title: '', body: '', userId: 1});
  public editTaskEvent = this.editTask.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  deletePost(id: number): Observable<Object> {
    return this.http.delete<Object>(`${this.apiUrl}/posts/${id}`);
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  editPost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${post.id}`, post);
  }

  emitEditEvent(post: Post): void {
    this.editTask.next(post);
  }

}
