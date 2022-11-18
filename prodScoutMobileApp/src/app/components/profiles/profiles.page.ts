import { Component, OnInit } from '@angular/core';
import { profileModels } from 'src/app/models/profile.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { userModel } from 'src/app/models/user.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit {
  profileId: any;
  firstName: any;
  lastName: any;
  password: any;
  selectedProfile: any;
  profileList!: profileModels[];
  avBoy: any;
  avGirl: any;
  avSelect: any;

  profile: profileModels = {
    profileId: '',
    firstName: '',
    lastName: '',
    accountCount: '',
    profileType: '',
    strictMode: true,
    holidayMode: false,
    profilePassword: '',
    profileUrl: '',
    username: '',
    nudge: false,
    ssrequest: false,
    startSessionDate: '',
    endSessionDate: '',
  };

  storedUserData: any;
  userData!: userModel[];
  logUser: any;
  logRole: any;
  logUserName: any;
  queriedProfile!: profileModels[];
  profileDocumentId: any;

  private profileCollection!: AngularFirestoreCollection<profileModels>;
  savedProfiles!: Observable<profileModels[]>;

  private profileCollectionUpdate!: AngularFirestoreCollection<profileModels>;
  savedProfilesUpdate!: Observable<profileModels[]>;

  constructor(
    public alertController: AlertController,
    private router: Router,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.logUser = this.userData[0].firstName;
    this.logRole = this.userData[0].role;
    this.logUserName = this.userData[0].username;

    this.avBoy =
      'https://firebasestorage.googleapis.com/v0/b/prodscout-90022.appspot.com/o/2880690.png?alt=media&token=3b695e30-0c8c-47a4-85d1-ff9058717206';
    this.avGirl =
      'https://firebasestorage.googleapis.com/v0/b/prodscout-90022.appspot.com/o/2880587.png?alt=media&token=8262c3ad-b166-4d83-afed-19530dff6236';

    this.profileCollection = this.afs.collection('profiles', (ref) =>
      ref.where('username', '==', this.logUserName)
    );

    this.savedProfiles = this.profileCollection.valueChanges();
    this.savedProfiles.subscribe((data) => (this.profileList = data));
  }

  getProfile() {
    this.profileCollectionUpdate = this.afs.collection('profiles', (ref) =>
      ref
        .where('profileId', '==', this.selectedProfile)
        .where('username', '==', this.logUserName)
    );

    this.savedProfilesUpdate = this.profileCollectionUpdate
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as profileModels;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );

    this.savedProfilesUpdate.subscribe(
      (data) => (
        (this.queriedProfile = data),
        (this.profileId = this.queriedProfile[0].profileId),
        (this.firstName = this.queriedProfile[0].firstName),
        (this.lastName = this.queriedProfile[0].lastName),
        (this.password = this.queriedProfile[0].profilePassword),
        (this.profileDocumentId = this.queriedProfile[0].id)
      )
    );
  }

  updateAccount() {
    if (!this.queriedProfile) {
      return this.prompt();
    }

    if (
      !this.profileId ||
      !this.firstName ||
      !this.lastName ||
      !this.password
    ) {
      this.validate();
    } else {
      this.afs.collection('profiles').doc(this.profileDocumentId).update({
        firstName: this.firstName,
        lastName: this.lastName,
        profileId: this.profileId,
        profilePassword: this.password,
      });
      this.update();
    }
  }

  deleteAccount() {
    if (!this.queriedProfile) {
      return this.prompt();
    }

    this.afs.collection('profiles').doc(this.profileDocumentId).delete();
    return this.deleteProfile;
  }

  AddAccount() {
    if (
      !this.profileId ||
      !this.firstName ||
      !this.lastName ||
      !this.password
    ) {
      return this.validate();
    }

    this.profile.profileId = this.profileId;
    this.profile.firstName = this.firstName;
    this.profile.lastName = this.lastName;
    this.profile.profilePassword = this.password;
    this.profile.profileUrl = this.avSelect;
    this.profile.username = this.logUserName;

    this.afs.collection('profiles').add(this.profile);
    this.addProfile();
  }

  selectAvBoy() {
    document.getElementById('maleDiv')!.style.backgroundColor = '#5F9DF7';
    document.getElementById('femaleDiv')!.style.backgroundColor = 'transparent';
    this.avSelect = this.avBoy;
  }
  selectAvGirl() {
    document.getElementById('femaleDiv')!.style.backgroundColor = '#FFD6EC';
    document.getElementById('maleDiv')!.style.backgroundColor = 'transparent';
    this.avSelect = this.avGirl;
  }

  returnDb() {
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  async addProfile() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Profile has been added',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async deleteProfile() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Profile has been deleted',
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

  async validate() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Please complete all details',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async prompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Please load a profile',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
