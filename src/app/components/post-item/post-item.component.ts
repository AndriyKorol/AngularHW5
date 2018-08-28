import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from '../../models/Post';
import {Comment} from '../../models/Comment';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommentsService} from '../../services/comment.service';
import {PostService} from '../../services/post.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input('postItem') postItem: Post;
  @Output() delete: EventEmitter <number> = new EventEmitter();
  @Output() editPost: EventEmitter <Post> = new EventEmitter();
  @Output() cancel: EventEmitter <Post> = new EventEmitter();

  comment: Comment = {
    name: '',
    email: '',
    body: '',
    userId: 1
  };
  comments: Comment[];
  post: Post = {
    userId: 1,
    id: 0,
    title: '',
    body: '',
    email: '',
    commentsHidden: true
  };
  posts: Post[];
  editPostId: number;

  constructor(
    public postService: PostService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public commentService: CommentsService
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      if (this.postItem.id === post.id) {
        this.editPostId = post.id;
      } else {
        this.editPostId = 0;
      }
    });
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  toggleComments(post: Post) {
    if (post.commentsHidden) {
      this.spinner.show();
      if (post.id > 100) { post.id -= 100; }
      this.commentService.getCommentsFromPost(post.id).subscribe((comments: Comment[]) => this.comments = comments);
      post.commentsHidden = false;
      this.spinner.hide();
    } else {
      post.commentsHidden = true;
    }
  }

  onEdit(post: Post) {
    const postEdited: Post = {
      title: post.title,
      body: post.body,
      id: post.id,
      userId: post.userId,
      email: post.email,
      commentsHidden: post.commentsHidden
    };
    this.postService.emitEditEvent(postEdited);
  }

  onCancel() {
    this.postService.emitEditEvent({title: '', body: '', userId: 1});
  }
}
