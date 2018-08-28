import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../../services/post.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  post: Post = {
    userId: 1,
    id: 1,
    title: '',
    body: '',
    email: '',
    commentsHidden: true
  };
  posts: Post[];

  constructor(
    public postService: PostService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.postService.getPosts().subscribe((posts: Post[]) => {
    this.posts = posts;
    this.posts.forEach(posti => posti.commentsHidden = true);
    this.spinner.hide();
    });
  }

  delete(id: number) {
    this.spinner.show();
    this.postService.deletePost(id).subscribe((data: Object) => {
      this.posts = this.posts.filter(postItem => postItem.id !== id);
      this.spinner.hide();
      this.toastr.success( 'Post deleted success', 'Message');
    }, error => {
      this.toastr.error(error.message);
    });
  }

  onAddPost(postNew: Post) {
    this.posts.unshift(postNew);
  }

  onEdit(post: Post) {
    const updatePost = {
      title: this.post.title,
      body: this.post.body,
      userId: this.post.userId,
      id: this.post.id,
      email: this.post.email,
      comments: this.post.commentsHidden
    };
    this.spinner.show();
    this.postService.editPost(post).subscribe((post: Post) => {
      this.spinner.hide();
      this.posts.forEach(newPost => {
        if (newPost.id === post.id) {
          newPost.title = post.title;
          newPost.body = post.body;
          newPost.email = post.email;
        }
      });
      this.toastr.success(`Post "${post.title}" was saved`, 'Success!');
      }, error => {
        this.spinner.hide();
        this.toastr.error(`${error.message}`, 'Error!');
      });
    this.postService.emitEditEvent({ title: '', body: '', email: '', userId: 0, commentsHidden: true });
    }
}
