import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { userModel } from '../models/user.model';
import { profileModels } from '../models/profile.model';
import { sessionModels } from '../models/session.model';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  storedUserData: any;
  userData!: userModel[];
  logUser: any;
  logRole: any;
  logUserName: any;
  logProfileUrl: any;
  logFirstName: any;
  logLastName: any;
  profileList!: profileModels[];
  profileDetails!: profileModels;
  eventList!: sessionModels[];
  logEmail: any;
  profileId: any;
  profileDataId: any;
  profileUsername: any;
  selectedProfile: any;

  private profileCollection!: AngularFirestoreCollection<profileModels>;
  savedProfiles!: Observable<profileModels[]>;

  private qprofileCollection!: AngularFirestoreCollection<profileModels>;
  qsavedProfiles!: Observable<profileModels[]>;

  private eventCollection!: AngularFirestoreCollection<sessionModels>;
  sessions!: Observable<sessionModels[]>;

  constructor(
    public afs: AngularFirestore,
    private router: Router,
    private photoViewer: PhotoViewer,
    public alertController: AlertController
  ) {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.logUser = this.userData[0].firstName;
    this.logRole = this.userData[0].role;
    this.logUserName = this.userData[0].username;
    this.logProfileUrl = this.userData[0].profileImage;
    this.logFirstName = this.userData[0].firstName;
    this.logLastName = this.userData[0].lastName;
    this.logEmail = this.userData[0].email;

    this.profileCollection = this.afs.collection('profiles', (ref) =>
      ref.where('username', '==', this.logUserName)
    );

    this.savedProfiles = this.profileCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as profileModels;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
    this.savedProfiles.subscribe((data) => (this.profileList = data));
  }

  getProfile() {
    //this.profileDetails = profile;
    this.profileUsername = this.logUserName;
    this.selectedProfile = this.profileId;
    //this.profileDataId = this.profileDetails.id;

    this.eventCollection = this.afs.collection('sessions', (ref) =>
      ref
        .where('profileId', '==', this.selectedProfile)
        .where('username', '==', this.profileUsername)
        .limit(100)
        .orderBy('sessiongLogDate', 'desc')
    );

    this.sessions = this.eventCollection.valueChanges();
    this.sessions.subscribe((data) => (this.eventList = data));

    this.qprofileCollection = this.afs.collection('profiles', (ref) =>
      ref
        .where('profileId', '==', this.selectedProfile)
        .where('username', '==', this.profileUsername)
    );

    this.qsavedProfiles = this.qprofileCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as profileModels;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );

    this.qsavedProfiles.subscribe(
      (data) => (
        (this.profileDetails = data[0]),
        (this.profileDataId = this.profileDetails.id)
      )
    );
  }

  viewImage(url: any) {
    this.photoViewer.show(url);
  }

  getScreenshot() {
    if (!this.profileDetails) {
      return this.noDetails();
    }

    this.afs.collection('profiles').doc(this.profileDataId).update({
      ssrequest: true,
    });

    setTimeout(() => {
      this.afs.collection('profiles').doc(this.profileDataId).update({
        ssrequest: false,
      });
    }, 3000);

    this.screenshot();
  }

  sendNudge() {
    if (!this.profileDetails) {
      return this.noDetails();
    }

    this.afs.collection('profiles').doc(this.profileDataId).update({
      nudge: true,
    });

    setTimeout(() => {
      this.afs.collection('profiles').doc(this.profileDataId).update({
        nudge: false,
      });
    }, 3000);

    this.nudge();
  }

  enableStrict() {
    if (!this.profileDetails) {
      return this.noDetails();
    }

    this.afs.collection('profiles').doc(this.profileDataId).update({
      strictMode: true,
      holidayMode: false,
    });

    this.strict();
  }

  enableHoliday() {
    if (!this.profileDetails) {
      return this.noDetails();
    }

    this.afs.collection('profiles').doc(this.profileDataId).update({
      strictMode: false,
      holidayMode: true,
    });

    this.holiday();
  }
  openMyProfile() {
    this.router.navigateByUrl('/myprofile', { replaceUrl: true });
  }

  openManageProfiles() {
    this.router.navigateByUrl('/profiles', { replaceUrl: true });
  }

  openBlackList() {
    this.router.navigateByUrl('/blacklist', { replaceUrl: true });
  }

  openWatchList() {
    this.router.navigateByUrl('/watchlist', { replaceUrl: true });
  }

  logOut() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async screenshot() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Screenshot',
      message: 'Screenshot has been requested, check gallery',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async nudge() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Nudge',
      message: 'We let ' + this.selectedProfile + ' knew, you have nudge them',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async strict() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Strict Mode',
      message: 'Strict Mode Enable',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async holiday() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Holiday Mode',
      message: 'Holiday Mode Enable',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async noDetails() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No Selected Profile',
      message: 'Please select a profile first',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
