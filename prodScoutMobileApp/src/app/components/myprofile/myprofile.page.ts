import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { userModel } from 'src/app/models/user.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {
  logProfileUrl: any;
  firstName: any;
  lastName: any;
  username: any;
  email: any;
  contactNo: any;
  password: any;
  accountId: any;
  storedUserData: any;
  userData!: userModel[];
  logEmail: any;
  logUsername: any;
  userList!: userModel[];
  chx: any;
  eventImage: any;
  imagePathName: any;
  imageRef: any;
  imageBaseRef: any;
  imageSub: any;
  imageUrl: any;
  userCredentials!: userModel[];

  private userCollection!: AngularFirestoreCollection<userModel>;
  users!: Observable<userModel[]>;

  private userValidationCollection!: AngularFirestoreCollection<userModel>;
  validatedUsers!: Observable<userModel[]>;

  constructor(
    public alertController: AlertController,
    private router: Router,
    public afs: AngularFirestore,
    private afsU: AngularFireStorage
  ) {}

  ngOnInit() {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.logEmail = this.userData[0].email;
    this.logUsername = this.userData[0].username;
    this.logProfileUrl = this.userData[0].profileImage;

    this.userCollection = this.afs.collection('users', (ref) =>
      ref
        .where('username', '==', this.logUsername)
        .where('email', '==', this.logEmail)
    );

    this.users = this.userCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as userModel;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );

    this.users.subscribe((data) => {
      (this.userList = data),
        (this.accountId = this.userList[0].id),
        (this.firstName = this.userList[0].firstName),
        (this.lastName = this.userList[0].lastName),
        (this.email = this.userList[0].email),
        (this.contactNo = this.userList[0].contactNo),
        (this.username = this.userList[0].username),
        (this.password = this.userList[0].password);
    });
  }

  updateProfile() {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.contactNo ||
      !this.password
    ) {
      this.validate();
    } else {
      this.contactNo = this.contactNo.slice(1);
      this.contactNo = '+63' + this.contactNo;
      this.afs.collection('users').doc(this.accountId).update({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        contactNo: this.contactNo,
      });

      this.update();
    }
  }

  /* uploadProfile(event: any) {
    this.eventImage = event.target.files[0];
    this.uploadProfileFb();
  }

  uploadProfileFb() {
    this.imagePathName = 'profile' + Math.random();
    this.imageRef = this.afsU.ref(this.imagePathName);

    this.imageBaseRef = this.afsU.upload(this.imagePathName, this.eventImage);
    this.imageSub = this.imageBaseRef
    .snapshotChanges()
    .pipe(concatWith(this.imageRef.getDownloadURL()))
    .subscribe((url: Observable<string>) => {
      this.imageUrl = url;
      console.log(this.imageUrl);
      this.logProfileUrl = this.imageUrl;
      this.afs.collection('users').doc(this.accountId).update({
        profileImage: this.imageUrl,
      });

        this.users.subscribe(
          (data) => (
            (this.userCredentials = data),
            localStorage.setItem(
              'userData',
              JSON.stringify(this.userCredentials)
            ),
            this.router.navigateByUrl('/myprofile', { replaceUrl: true })
          )
        );
      });
  } */

  updatePassword() {
    if (this.password.length < 6) {
      this.passwordUpdate();
    }

    if (!this.password) {
      this.validate();
    }

    for (let i = 0; i < this.password.length; i++) {
      this.chx = this.password.charCodeAt(i);
      if (
        !(this.chx > 47 && this.chx < 58) && // numeric (0-9)
        !(this.chx > 64 && this.chx < 91) && // upper alpha (A-Z)
        !(this.chx > 96 && this.chx < 123)
      ) {
        this.afs.collection('users').doc(this.accountId).update({
          password: this.password,
        });
        this.update();
      } else {
        this.passwordUpdate();
        return;
      }
      return;
    }
  }

  returnDb() {
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  async validate() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Please complete all details',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async passwordUpdate() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message:
        'Password should be at least 6 characters long and must be alphanumeric',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async update() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Profile has been updated',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
