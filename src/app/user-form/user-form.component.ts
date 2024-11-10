import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../app.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  allUsers!: User[];
  isEdit = false;
  @Output() userAdded = new EventEmitter<void>();
  public userForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.isEdit = true;
      this.userForm.addControl('id', new FormControl());
      this.userForm.patchValue(this.data.user);
    }
  }

  saveUser() {
    if (this.isEdit) {
      let data = localStorage.getItem('users');
      data ? (this.allUsers = JSON.parse(data)) : (this.allUsers = []);
      const index = this.allUsers.findIndex(
        (user) => user.id === this.userForm.value.id
      );
      if (index !== -1) {
        this.allUsers[index] = this.userForm.value; // Replace the user with updated data
      }

      localStorage.setItem('users', JSON.stringify(this.allUsers));
      this.userForm.reset();
      this.isEdit = false;
      this.dialogRef.close();
      this.userAdded.emit();
    } else {
      const UID = uuidv4();
      this.userForm.addControl('id', new FormControl());
      this.userForm.get('id')?.setValue(uuidv4());
      let data = localStorage.getItem('users');
      data ? (this.allUsers = JSON.parse(data)) : (this.allUsers = []);
      this.allUsers.unshift(this.userForm.value);

      localStorage.setItem('users', JSON.stringify(this.allUsers));
      this.userForm.reset();
      this.dialogRef.close();
      this.userAdded.emit();
    }
  }
}
