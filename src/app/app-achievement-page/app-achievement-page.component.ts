import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AppService } from '../app.service';
import { IProfile } from 'src/mapping/IProfile';
import { SnackBarService } from 'ng7-snack-bar';
import { IAchievementStatus } from 'src/mapping/IAchievementStatus';

@Component({
    selector: 'app-achievement',
    templateUrl: './app-achievement-page.component.html',
    styleUrls: ['./app-achievement-page.component.sass']
})
export class AppAchievementPageComponent {
    @Input() profile: IProfile;
    @Input() completedAchievements: Array<IAchievementStatus>;
    @Input() incompletedAchievements: Array<IAchievementStatus>;

    getPercentage(achievement: IAchievementStatus): string {
        if (!achievement) {
            return "";
        }

        return `${Math.round((achievement.CurrentPoints / achievement.Achievement.RequiredPoints) * 100)}`;
    }

}
