import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { UserFormComponent } from './user-form/user-form.component';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['no', 'name', 'email', 'role', 'actions'];
  users: User[] = [];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    const data = localStorage.getItem('users');
    this.users = data ? JSON.parse(data) : [];
    this.dataSource.data = this.users;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog() {
    const dialogRef = this.dialog.open(UserFormComponent);
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.loadUsers();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, { data: { user } });
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.loadUsers();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.users = this.users.filter((user) => user.id !== userId);
        this.dataSource.data = this.users;
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    });
  }
}
