import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { userModel } from '../models/user.model';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public afs: AngularFirestore,
    private router: Router,
    public alertController: AlertController,
    private iab: InAppBrowser
  ) {}
  private userCollection!: AngularFirestoreCollection<userModel>;
  users!: Observable<userModel[]>;

  private logUserCollection!: AngularFirestoreCollection<userModel>;
  logUsers!: Observable<userModel[]>;

  email: any;
  password: any;
  userList: userModel[];
  userCreds: userModel[];
  browser: any;

  ngOnInit() {
    // Clears Credentials
    localStorage.removeItem('userData');
    localStorage.clear();
    // Retrieve User list
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
    this.users.subscribe((data) => (this.userList = data));
  }

  login() {
    if (!this.email || !this.password) {
      return this.emptyAlert();
    } else {
      for (let i = 0; i < this.userList.length; i++) {
        if (
          this.email == this.userList[i].email &&
          this.password == this.userList[i].password
        ) {
          this.logUserCollection = this.afs.collection('users', (ref) =>
            ref
              .where('email', '==', this.email)
              .where('password', '==', this.password)
          );
          this.logUsers = this.logUserCollection.valueChanges();
          this.logUsers.subscribe(
            (data) => (
              (this.userCreds = data),
              localStorage.setItem('userData', JSON.stringify(this.userCreds)),
              this.router.navigateByUrl('/tabs', { replaceUrl: true })
            )
          );
          return;
        }
      }
      this.invalidAlert();
    }
  }

  redirect() {
    this.browser = this.iab.create('https://prodscout.vercel.app/#/home');
  }

  async invalidAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Log In',
      message: 'Invalid Credentials, Please try again',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async emptyAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Log In',
      message: 'Email and Password should not be empty',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
