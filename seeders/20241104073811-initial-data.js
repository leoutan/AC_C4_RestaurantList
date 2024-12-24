'use strict';
const bcrypt = require('bcryptjs')
const path = require('path')
const restaurants = require(path.join(__dirname, "..", "data", "restaurant.json")).results
restaurants.forEach((data)=>{
  if(data.id<=3) {
    data.userId = 1
  } else if(data.id>3 && data.id<=6) {
    data.userId = 2
  } else {
    data.userId = 3
  }
})



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()
      const initialUser = await Promise.all(Array.from({length:3}, async (_, i)=>{
        const hash = await bcrypt.hash('12345678', 10)
        return {
          id: i+1,
          name: `user${i+1}`,
          email: `user${i+1}@example.com`,
          password: hash
        }
      }))

      await queryInterface.bulkInsert('users', initialUser, {transaction})

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
            rating: rt.rating,
            userId: rt.userId
          }
        }), {transaction}
      )
      await transaction.commit()
    } catch (error) {
      if(transaction) transaction.rollback()
    }
        

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants')
  }
};
