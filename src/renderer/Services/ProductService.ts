import axios from 'axios';

export default class ProductService {
  private url = 'https://mart.rajalakshmimart.com';

  private key = '2021@mart/server/key|{www.devash.tech}';

  // eslint-disable-next-line class-methods-use-this
  async getAllProducts() {
    console.log('caling');
    const result = await axios.get(`${this.url}/getAllProducts`, {
      headers: { key: this.key },
    });
    console.log(result)
    if(result.data.message=='success'){
      return result.data.allProducts
    }
    return [];
  }

}
