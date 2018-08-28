import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { Post } from '../../models/Post';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import {post} from 'selenium-webdriver/http';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  @Output() onAddNewPost: EventEmitter <Post> = new EventEmitter();
  @Output() cancel: EventEmitter <Post> = new EventEmitter();
  @Output() save: EventEmitter<Post> = new EventEmitter();
  @ViewChild('form') _form: NgForm;

  formData: Post = {
    userId: 1,
    id: 101,
    title: '',
    body: '',
    email: ''
  };

  constructor(
    public postService: PostService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((postNew: Post) => {
      this.formData = postNew;
    });
}

  addPost() {
    if (this._form.invalid) return ;
    this.spinner.show();

      const newPost: Post = {
        userId: this.formData.userId,
        id: this.formData.id,
        title: this.formData.title,
        body: this.formData.body,
        email: this.formData.email
      };

      this.postService.addPost(newPost).subscribe((data: Post) => {
        if (data.id) {
          this.onAddNewPost.emit(data);
        }
        this.spinner.hide();
        this.toastr.success(`Post "${data.title}" was created`, 'Success!');
      }, error => {
        this.spinner.hide();
        this.toastr.error( `${error.message}`, 'Error!');
      });
      this.formData.id += 1;
      this._form.resetForm();
  }

  onCancel() {
    this.postService.emitEditEvent({title: '', body: '', userId: 1});
  }

  onSaveEditedPost() {
    const postEdited: Post = {
      userId: this.formData.userId,
      id: this.formData.id,
      title: this.formData.title,
      body: this.formData.body,
      email: this.formData.email
    };
    this.postService.editPost(postEdited).subscribe((postAny: Post) => {
      this.save.emit(postEdited);
      this._form.resetForm();
    });
    this._form.resetForm();
  }
}
