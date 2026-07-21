export const contact = {
  whatsappNumber: '6285117148742',
  email: 'fadeta287@gmail.com',
  location: 'Surabaya, Indonesia'
};

export function createWhatsAppLink(message = 'Halo Gandiva Labs, saya ingin membahas kebutuhan website bisnis saya.') {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
