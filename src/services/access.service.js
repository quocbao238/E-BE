const shopModel = require("../models/shop.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email already exists",
          status: "error",
        };
      }

      const newShop = await shopModel.create({ name, email, password, roles });
    } catch (error) {
      return {
        code: 500,
        message: error.message,
        status: "error",
      };
    }
  };
}
