/**
 * Mailchimp popup config
 *
 * Get your list ID from Mailchimp:
 * Audience → Signup forms → Form builder → Embedded forms → copy the form action URL
 * It looks like: https://us21.list-manage.com/subscribe/post?u=3f69bab8ef6446338dce0b642&id=XXXXXXXX
 *
 * Paste the "id" value below and the datacenter prefix (e.g. us21) from that URL.
 */
window.SPARK_MAILCHIMP_CONFIG = {
  u: '3f69bab8ef6446338dce0b642',
  id: '',
  dc: 'us21',
  delayMs: 12000,
  showOnceDays: 7
};