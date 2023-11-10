const { Queue } = require("../model");

//Get all teams on the queue

const getQueue = async (req, res) => {
  try {
    const queue = await Queue.findAll({
      where: {
        status: "PENDING",
      },
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getQueue };
