import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { profileModels } from '../models/profile.model';
import { userModel } from '../models/user.model';
import { profileLogsModel } from '../models/profileLog.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  private profileCollection!: AngularFirestoreCollection<profileModels>;
  savedProfiles!: Observable<profileModels[]>;

  private eventCollection!: AngularFirestoreCollection<profileLogsModel>;
  events!: Observable<profileLogsModel[]>;

  selectedProfile: any;
  profileList!: profileModels[];
  profileUsername: any;
  storedUserData: any;
  userData!: userModel[];
  filterValue: any;
  eventList!: profileLogsModel[];

  constructor(public afs: AngularFirestore) {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.profileUsername = this.userData[0].username;

    this.profileCollection = this.afs.collection('profiles', (ref) =>
      ref.where('username', '==', this.profileUsername)
    );

    this.savedProfiles = this.profileCollection.valueChanges();
    this.savedProfiles.subscribe((data) => (this.profileList = data));
  }

  getLogs() {
    this.eventCollection = this.afs.collection('profileLogs', (ref) =>
      ref
        .where('profileName', '==', this.selectedProfile)
        .where('userName', '==', this.profileUsername)
        .orderBy('logDate', 'desc')
        .limit(500)
    );
    this.events = this.eventCollection.valueChanges();
    this.events.subscribe((data) => (this.eventList = data));
  }
}
