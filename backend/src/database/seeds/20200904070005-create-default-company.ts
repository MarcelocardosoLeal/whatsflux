import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.bulkInsert(
        "Plans",
        [
          {
            name: "Plano 1",
            users: 10,
            connections: 10,
            queues: 10,
            value: 30,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction: t }
      );

      return queryInterface.bulkInsert(
        "Companies",
        [
          {
            name: "Empresa 1",
            planId: 1,
            dueDate: "2093-03-14 04:00:00+01",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction: t }
      );
    });
  },

  down: async (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete("Companies", {}),
      queryInterface.bulkDelete("Plans", {})
    ]);
  }
};
