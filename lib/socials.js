import {
  FaInstagram,
  FaSnapchat,
  FaXTwitter,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaTelegram,
  FaLinkedinIn,
  FaThreads,
} from "react-icons/fa6";

export const SOCIAL_NETWORKS = [
  { key: "instagram_url", name: "Instagram", Icon: FaInstagram },
  { key: "snapchat_url", name: "Snapchat", Icon: FaSnapchat },
  { key: "x_url", name: "X", Icon: FaXTwitter },
  { key: "facebook_url", name: "Facebook", Icon: FaFacebookF },
  { key: "tiktok_url", name: "TikTok", Icon: FaTiktok },
  { key: "youtube_url", name: "YouTube", Icon: FaYoutube },
  { key: "telegram_url", name: "Telegram", Icon: FaTelegram },
  { key: "linkedin_url", name: "LinkedIn", Icon: FaLinkedinIn },
  { key: "threads_url", name: "Threads", Icon: FaThreads },
];

export function getSocialLinks(settings = {}) {
  return SOCIAL_NETWORKS.map(({ key, name, Icon }) => ({
    name,
    Icon,
    href: settings?.[key],
  })).filter((s) => s.href);
}
