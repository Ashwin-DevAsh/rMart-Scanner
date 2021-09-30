import axios from 'axios';

export default class QrService {
  private url = 'https://mart.rajalakshmimart.com';

  private key = '2021@merchant/server/key|{www.devash.tech}~merChAnT';

  // eslint-disable-next-line class-methods-use-this
  async getProductFromQr(qrCode: string) {
    console.log('caling');
    const result = await axios.get(`${this.url}/getQrToken/${qrCode}`, {
      headers: { key: this.key },
    });
    return result.data;
  }

  async makeDelivery(qrCode: string) {
    console.log('caling');
    const result = await axios.post(
      `${this.url}/makeDelivery`,
      {
        id: qrCode,
      },
      {
        headers: { key: this.key },
      }
    );
    return result.data;
  }
}
