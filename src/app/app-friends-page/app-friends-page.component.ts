import { Component, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AppService } from '../app.service';
import { IProfile } from 'src/mapping/IProfile';
import { IFriend } from 'src/mapping/IFriend';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { FriendRequestStatus, IUserFlat } from 'src/mapping/IUserFlat';
import { IAchievementStatus } from 'src/mapping/IAchievementStatus';
import { element } from '@angular/core/src/render3';
import { SnackBarService } from 'ng7-snack-bar';



@Component({
    selector: 'app-friends',
    templateUrl: './app-friends-page.component.html',
    styleUrls: ['./app-friends-page.component.sass']
})
export class AppFriendsPageComponent {

    constructor(
        private notificationService: SnackBarService,
        private appService: AppService,
        private authenticationService: AuthenticationService
        ) {}

    private _friends: Array<IProfile>;
    private friendTableData: MatTableDataSource<IProfile>;
    private profile: IProfile;
    private achievementData: Array<IProfile>;
    private achievementDatas: MatTableDataSource<IAchievementStatus>;
    private displayedColumns = ['Naam', 'achievements', 'actions'];
    

    @Input()
    set friends(friends: Array<IProfile>) {
        this._friends = friends;
        const list = [];
        friends.forEach(element => {
            element.User.Id = element.Id;
            list.push(element.User);
        });
        this.friendTableData = new MatTableDataSource(list);
    }
    get friends(): Array<IProfile> {
        return this._friends;
    }
    onRemoveUser(user: IUserFlat): void {
        console.log(user);
        this.appService.removeFriend(user.Id).subscribe(
            (resp) => {

                    this.notificationService.success('Vriend verwijderd!', `Vriend '${user.Username}' verwijderd!`);

            },
            (err) => {
                if (err.status === 401) {
                    this.authenticationService.logout('/profile');
                } else {
                    this.notificationService.error('Er is iets mis gegaan', `${err.error.Message}`);
                }
            }
        );
    }
    getCompletedAchievements(friend: IProfile): Array<IAchievementStatus> {
        const friendProfile = this._friends.filter(x => x.User.Id === friend.Id)[0];
        if (!friendProfile || !friendProfile.Achievements) {
            return [];
        }

        const completedAchievements: Array<IAchievementStatus> = [];
        friendProfile.Achievements.forEach(element => {
            if (element.CurrentPoints >= element.Achievement.RequiredPoints) {
                completedAchievements.push(element);
            }
        });

        return completedAchievements;
    }

    applyFilter(filterValue: string) {
        this.friendTableData.filter = filterValue.trim().toLowerCase();
    }
}
