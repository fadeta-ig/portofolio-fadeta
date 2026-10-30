export const contact = {
  whatsappNumber: '6285117148742',
  email: 'fadeta287@gmail.com',
  location: 'Surabaya, Indonesia',
  phoneDisplay: '+62 851-1714-8742',
  phoneHref: 'tel:+6285117148742',
  serviceArea: 'Melayani Blitar, Surabaya, dan Jawa Timur'
};

export function createWhatsAppLink(message = 'Halo Gandiva Labs, saya ingin membahas kebutuhan website bisnis saya.') {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
