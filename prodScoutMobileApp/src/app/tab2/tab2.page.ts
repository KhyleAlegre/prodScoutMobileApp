import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { profileModels } from '../models/profile.model';
import { userModel } from '../models/user.model';
import { galleryModels } from '../models/gallery.model';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  private profileCollection!: AngularFirestoreCollection<profileModels>;
  savedProfiles!: Observable<profileModels[]>;

  private galleryCollection!: AngularFirestoreCollection<galleryModels>;
  galleries!: Observable<galleryModels[]>;

  selectedProfile: any;
  profileList!: profileModels[];
  profileUsername: any;
  storedUserData: any;
  userData!: userModel[];
  galleryList!: galleryModels[];

  constructor(
    public afs: AngularFirestore,
    private photoViewer: PhotoViewer,
    private router: Router
  ) {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.profileUsername = this.userData[0].username;

    this.profileCollection = this.afs.collection('profiles', (ref) =>
      ref.where('username', '==', this.profileUsername)
    );

    this.savedProfiles = this.profileCollection.valueChanges();
    this.savedProfiles.subscribe((data) => (this.profileList = data));
  }

  getGallery() {
    this.galleryCollection = this.afs.collection('gallery', (ref) =>
      ref
        .where('profileId', '==', this.selectedProfile)
        .where('userName', '==', this.profileUsername)
        .orderBy('logDate', 'desc')
        .limit(300)
    );

    this.galleries = this.galleryCollection.valueChanges();
    this.galleries.subscribe((data) => (this.galleryList = data));
  }

  loadViewer(url: any) {
    this.photoViewer.show(url);
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
}
