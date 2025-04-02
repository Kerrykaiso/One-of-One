const { Stock } = require('../models');
const AppError = require('../utils/appError');

const createStock = async (data,next) => {
  try {
    const newStock = await Stock.create(data);
    if (!newStock) {
      throw new AppError('Failed to create stock', 'failed', 400);
    }
    return newStock;
  } catch (error) {
    return next(error);
  }
}

module.exports = { createStock };