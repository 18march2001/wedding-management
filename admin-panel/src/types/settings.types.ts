// General Settings
export interface GeneralSettings {
  studio_name: string;
  studio_email: string;
  studio_phone: string;
  studio_address: string;
  studio_city: string;
  studio_state: string;
  studio_zip: string;
  studio_country: string;
  website_url: string;
  timezone: string;
  language: string;
}

// Profile/About
export interface ProfileSettings {
  about_title: string;
  about_description: string;
  about_image_url?: string;
  founder_name: string;
  founder_bio?: string;
  founded_year: number;
}

// Social Links
export interface SocialSettings {
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  pinterest_url?: string;
}

// Footer Settings
export interface FooterSettings {
  copyright_year: number;
  footer_description: string;
  quick_links: FooterLink[];
}

export interface FooterLink {
  title: string;
  url: string;
  order: number;
}

// Security Settings (Admin Only)
export interface SecuritySettings {
  require_email_verification: boolean;
  login_attempts_limit: number;
  session_timeout: number;
  password_expiry_days?: number;
  require_password_change_on_first_login: boolean;
  allow_password_reset: boolean;
}

// All Settings Combined
export interface AppSettings extends GeneralSettings {
  profile: ProfileSettings;
  social: SocialSettings;
  footer: FooterSettings;
  security: SecuritySettings;
}

// Payload for updates
export interface UpdateSettingsPayload {
  general?: Partial<GeneralSettings>;
  profile?: Partial<ProfileSettings>;
  social?: Partial<SocialSettings>;
  footer?: Partial<FooterSettings>;
  security?: Partial<SecuritySettings>;
}
