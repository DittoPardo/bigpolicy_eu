import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user';
import { LeaderService } from '../leader';
import { Subscription } from 'rxjs/Subscription';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'app-bp-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  showCreateLeaderButton;
  subscription: Subscription;

  constructor(
    public leaderService: LeaderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log('SUBSCRIBE: Navbar' );

    this.subscription = this.leaderService.leaderStream
      .subscribe(item => {
        this.showCreateLeaderButton = this.userService.authenticated() && !this.userService.hasLeader();
        console.log('SUB NEXT NAVBAR:', this.showCreateLeaderButton );
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    console.log('UNSUBSCRIBE: Navbar');
    this.subscription.unsubscribe();
  }
}
