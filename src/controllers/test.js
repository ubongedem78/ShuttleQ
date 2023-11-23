const { User } = require("../model");
const { Op } = require("sequelize");

const testController = async (req, res) => {
  const { name } = req.body;

  const players = name.split(",").map((playerName) => playerName.trim());

  const users = await User.findAll({
    where: {
      userName: {
        [Op.or]: players.map((playerName) => ({
          [Op.iLike]: `%${playerName}`,
        })),
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
};

module.exports = { testController };
