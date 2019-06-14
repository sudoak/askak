const MESSAGE_MODAL = require("../modal/messages.modal");

const { isEmpty, isDate } = require("lodash"),
  fetch = require("node-fetch"),
  moment = require("moment"),
  shortId = require("shortid");

const message = () => {
  createMessage = async mObj => {
    try {
      mObj.date_time = moment();
      mObj.id = shortId.generate();
      const messageObj = new MESSAGE_MODAL(mObj);
      await messageObj.save();
    } catch (e) {
      console.error(e);
    }
    return;
  };

  getDayRemaining = async (id, date) => {
    try {
      const birthdate = moment(date, ["YYYY-MM-DD"]).format("YYYY-MM-DD");

      const today = moment().format("YYYY-MM-DD");

      const years = moment().diff(birthdate, "years");

      const adjustToday = birthdate.substring(5) === today.substring(5) ? 0 : 1;

      const nextBirthday = moment(birthdate).add(years + adjustToday, "years");

      const daysUntilBirthday = nextBirthday.diff(today, "days");

      return daysUntilBirthday;
    } catch (e) {
      return "NaN";
    }
  };
  postMessage = async (req, res) => {
    try {
      const messageObj = new MESSAGE_MODAL({
        id: shortId.generate(),
        userId: shortId.generate(),
        message: shortId.generate(),
        date_time: new Date()
      });
      const savedMessage = await messageObj.save();
      res.json({ error: false, info: null, data: savedMessage });
    } catch (e) {
      res.json({ error: true, info: e, data: [] });
    }
  };

  getAllMessages = async (req, res) => {
    try {
      const allMessages = await MESSAGE_MODAL.find(
        {},
        { _id: 0, __v: 0 }
      ).lean();
      res.json({ error: false, info: null, data: allMessages });
    } catch (e) {
      if (e.name === "Error") {
        res.status(404).json({ error: true, info: e, data: [] });
        return;
      }
      res.status(500).json({ error: true, info: e, data: [] });
    }
  };

  getMessageById = async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const message = await MESSAGE_MODAL.findOne({ id }, { _id: 0, __v: 0 });
        if (!isEmpty(message)) {
          res.json({ error: false, info: null, data: message });
          return;
        }
        throw new Error("No Message Related to this Id");
      } else {
        throw new Error("Please Send Message Id");
      }
    } catch (e) {
      if (e.name === "Error") {
        res.status(404).json({ error: true, info: e, data: {} });
        return;
      }
      res.status(500).json({ error: true, info: e, data: {} });
    }
  };

  deleteMessageById = async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const deletedMessage = await MESSAGE_MODAL.deleteOne({ id });

        if (deletedMessage.deletedCount !== 0) {
          res.json({
            error: false,
            info: null,
            data: { message: "Successfully Deleted" }
          });
          return;
        }
        throw new Error("No Message Related to this Id");
      } else {
        throw new Error("Please Send Message Id For Deletion");
      }
    } catch (e) {
      if (e.name === "Error") {
        res.status(404).json({ error: true, info: e, data: {} });
        return;
      }
      res.status(500).json({ error: true, info: e, data: {} });
    }
  };
  return {
    getDayRemaining,
    createMessage,
    postMessage,
    getAllMessages,
    getMessageById,
    deleteMessageById
  };
};
module.exports = message;
