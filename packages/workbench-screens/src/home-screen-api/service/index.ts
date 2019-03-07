import { Profile } from "../model";

export function fetchProfilePreference(): Promise<Profile> {
  return fetch("rest/homeScreen/profilePreference")
    .then(res => res.json())
    .then(profile => (profile.toString() === "FULL" ? Profile.FULL : Profile.PLANNER_AND_RULES));
}
