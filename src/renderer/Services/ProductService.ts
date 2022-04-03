import axios from 'axios';

export default class ProductService {
  private url = 'https://mart.rajalakshmimart.com';

  private key = '2021@mart/server/key|{www.devash.tech}';
  private merchantKey = '2021@merchant/server/key|{www.devash.tech}~merChAnT'

  // eslint-disable-next-line class-methods-use-this
  async getAllProducts() {
    console.log('caling');
    const result = await axios.get(`${this.url}/getMyProducts`, {
      headers: { key: this.key },
    });
    // console.log(result)
    if(result.data.message=='success'){
      return result.data.allProducts
    }
    return [];
  }

  async updateProduct(product) {
    console.log("product = ",product)
    const result = await axios.post(`https://mart.rajalakshmimart.com/updateProduct`,{
      "productID": parseInt(product.productid),
      "productName": product.productname,
      "ownerID": product.ownerid,
      "discription": product.discription,
      "category":product.category,
      "price": parseInt(product.price),
      "discount": product.discount,
      "isavailable": product.isavaliable,
      "quantity": product.quantity,
      "imageUrl": product.imageurl,
      "availableOn": product.availableon
    } ,{
      headers:{'key': this.merchantKey}
    }
      );

    console.log({
      "productID": parseInt(product.productid),
      "productName": product.productname,
      "ownerID": product.ownerid,
      "discription": product.discription,
      "category":product.category,
      "price": parseInt(product.price),
      "discount": product.discount,
      "isavailable": product.isavaliable,
      "quantity": product.quantity,
      "imageUrl": product.imageurl,
      "availableOn": product.availableon
    })
  }

}
