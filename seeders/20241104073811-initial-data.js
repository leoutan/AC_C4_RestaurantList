'use strict';
const path = require('path')
const restaurants = require(path.join(__dirname, "..", "data", "restaurant.json")).results
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants',
      restaurants.map((rt)=>{
        return {
          name: rt.name,
          name_EN: rt.name_en,
          category: rt.category,
          address: rt.location,
          phone: rt.phone,
          description: rt.description,
          image: rt.image,
          rating: rt.rating

        }
      })
    )    

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants')
  }
};
