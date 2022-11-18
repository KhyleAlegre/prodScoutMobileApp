import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { userModel } from 'src/app/models/user.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { watchlistModel } from 'src/app/models/watchlist.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
})
export class WatchlistPage implements OnInit {
  constructor(
    public alertController: AlertController,
    private router: Router,
    public afs: AngularFirestore
  ) {}

  private watchListCollection!: AngularFirestoreCollection<watchlistModel>;
  wLs!: Observable<watchlistModel[]>;

  watchList!: watchlistModel[];
  storedUserData: any;
  userData!: userModel[];
  logUsername: any;
  exeName: any;
  watchListDetails!: watchlistModel;
  category: any;

  ngOnInit() {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.logUsername = this.userData[0].username;
    this.watchListCollection = this.afs.collection('watchlist', (ref) =>
      ref.where('username', '==', this.logUsername)
    );

    this.wLs = this.watchListCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as watchlistModel;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );

    this.wLs.subscribe((data) => (this.watchList = data));
  }

  addExe() {
    if (!this.exeName || !this.category) {
      this.validate();
    } else {
      this.afs.collection('watchlist').add({
        applicationName: this.exeName,
        category: this.category,
        username: this.logUsername,
      });

      this.addUrlPrompt();
      this.exeName = '';
      this.category = '';
    }
  }

  removeExe(exeData: any) {
    this.watchListDetails = exeData;
    this.afs.collection('watchlist').doc(this.watchListDetails.id).delete();
    this.deleteUrl();
    this.exeName = '';
    this.category = '';
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

  async deleteUrl() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Removed from watchlist',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async addUrlPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Application has been added',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
