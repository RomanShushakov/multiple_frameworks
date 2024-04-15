import { Component, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppService } from "./app.service";
import { MaterialModule } from "./material.module";

export interface UserInfo {
  name: String;
  info: String;
  role: String;
}

export interface Participant {
  name: String;
  email: String;
  is_active: boolean;
}

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [CommonModule, MaterialModule],
})
export class AppComponent {
  userInfo: UserInfo = { name: "", info: "", role: "" };
  isParticipantsShown: boolean = false;
  participants: Participant[] = [];

  constructor(private appService: AppService) {
    this.appService.getUserInfo(import.meta.env.VITE_USER_INFO_URL, this.userInfo as UserInfo);
  }

  get isUserInfo(): boolean {
    return Object.values(this.userInfo).every((v) => v !== "");
  }

  toggle() {
    this.isParticipantsShown = !this.isParticipantsShown;
    if (this.isParticipantsShown && !this.participants.length) {
      this.appService.getParticipants(import.meta.env.VITE_USERS_URL, this.participants);
    }
  }

  async toggleUserStatus(email: String) {
    const user = this.participants.find((u) => u.email === email);
    if (user) {
      const newStatus = !user.is_active;
      this.appService.updateUserStatus(import.meta.env.VITE_UPDATE_USER_STATUS_URL, user, newStatus);
    }
  }
}
