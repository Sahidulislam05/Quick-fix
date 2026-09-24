export const STALE_TIME = {
  DEFAULT: 60 * 1000, // ১ মিনিট
  CATEGORIES: 30 * 60 * 1000, // ৩০ মিনিট — কম বদলায়
  PUBLIC_LISTS: 5 * 60 * 1000, // সার্ভিস/টেকনিশিয়ান লিস্ট — ৫ মিনিট
  OWN_DATA: 30 * 1000, // নিজের বুকিং/পেমেন্ট — ৩০ সেকেন্ড
} as const;
