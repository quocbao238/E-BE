const { getSelectData, unGetSelectData } = require('../../utils')

class DiscountRepo {
  static async findAllDiscountCodesUnSelect({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model,
  }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(unGetSelectData(unSelect))
      .lean()
      .exec()
  }

  static async findAllDiscountCodesSelect({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model,
  }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean()
      .exec()
  }

  static async checkDiscountExist({ model, filter }) {
    return await model.findOne(filter).lean()
  }
}

module.exports = DiscountRepo
