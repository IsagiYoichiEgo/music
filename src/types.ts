export interface MusicianProfile {
  first_name: string;
  specialization: string;
  specialization_display: string;
  bio: string;
  fee: string;
}
export interface User {
  id: number;
  username: string;
  profile: MusicianProfile;
}
export interface Credentials { username: string; password: string; }
export interface ProfileInput {
  first_name: string;
  specialization: string;
  bio: string;
  fee: string;
}
export interface Specialization { value: string; label: string; }
