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
import { blacklistmodels } from 'src/app/models/blacklist.model';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.page.html',
  styleUrls: ['./blacklist.page.scss'],
})
export class BlacklistPage implements OnInit {
  constructor(
    public alertController: AlertController,
    private router: Router,
    public afs: AngularFirestore
  ) {}
  private blackListCollection!: AngularFirestoreCollection<blacklistmodels>;
  bls!: Observable<blacklistmodels[]>;

  blackList!: blacklistmodels[];
  storedUserData: any;
  userData!: userModel[];
  logUsername: any;
  blackListDetails!: blacklistmodels;
  category: any;
  url: any;
  ngOnInit() {
    this.storedUserData = JSON.parse(localStorage.getItem('userData')!);
    this.userData = this.storedUserData;
    this.logUsername = this.userData[0].username;

    this.blackListCollection = this.afs.collection('blacklistSites', (ref) =>
      ref.where('username', '==', this.logUsername)
    );
    this.bls = this.blackListCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as blacklistmodels;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
    this.bls.subscribe((data) => (this.blackList = data));
  }

  returnDb() {
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  addUrl() {
    if (!this.url || !this.category) {
      this.validate();
    } else {
      this.afs.collection('blacklistSites').add({
        samplesite: this.url,
        category: this.category,
        username: this.logUsername,
      });

      this.addUrlPrompt();
      this.url = '';
      this.category = '';
    }
  }

  removeUrl(urlData: any) {
    this.blackListDetails = urlData;
    this.afs
      .collection('blacklistSites')
      .doc(this.blackListDetails.id)
      .delete();

    this.deleteUrl();
    this.url = '';
    this.category = '';
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
      message: 'Removed from blacklist',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async addUrlPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'Url / Site has been added',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
