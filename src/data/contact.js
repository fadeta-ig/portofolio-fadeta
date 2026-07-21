export const contact = {
  whatsappNumber: '6285117148742',
  whatsappDisplay: '+62 851-1714-8742',
  email: 'fadeta287@gmail.com',
  location: 'Surabaya, Indonesia'
};

export function createWhatsAppLink(message = 'Halo Gandiva Labs, saya ingin membahas kebutuhan website bisnis saya.') {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
