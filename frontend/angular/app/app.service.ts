import { Injectable } from "@angular/core";
import { UserInfo, Participant } from "./app.component";

@Injectable()
export class AppService {
  async getData(url: URL) {
    const response = await fetch(url);
    return response;
  }

  async getUserInfo(url: URL, userInfo: UserInfo) {
    const headers: any = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
      headers["Authorization"] = localStorage.getItem("token");
    }

    fetch(url, {
      method: "GET",
      mode: "cors",
      headers,
    })
    .then(async (response) => {
      if (response.status === 200) {
        const userInfoResponse: UserInfo = await response.json();
        userInfo.name = userInfoResponse.name;
        userInfo.info = userInfoResponse.info;
        userInfo.role = userInfoResponse.role;
      } else {
        this.getData("./login.html" as unknown as URL).then((response) => {
          window.location.href = response.url;
        });
      }
    });
  }

  async getParticipants(url: URL, participants: Participant[]) {
    const headers: any = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
      headers["Authorization"] = localStorage.getItem("token");
    }

    fetch(url, {
      method: "GET",
      mode: "cors",
      headers,
    })
    .then(async (response) => {
      if (response.status === 200) {
        const participantsResponse = await response.json();
        participants.push(...participantsResponse);
      }
    });
  }

  async updateUserStatus(url: URL, user: Participant, status: boolean) {
    const headers: any = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
      headers["Authorization"] = localStorage.getItem("token");
    }

    fetch(url, {
      method: "PATCH",
      mode: "cors",
      headers,
      body: JSON.stringify({ email: user.email, is_active: status }),
    })
    .then(async (response) => {
      if (response.status === 200) {
        user.is_active = status;
      }
    });
  }
}
