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

  getDayRemaining = async id => {
    try {
      const data = await MESSAGE_MODAL.find({ userId: id })
        .sort({
          date_time: -1
        })
        .limit(2);
      if (data.length === 2 && isDate(new Date(data[1].message))) {
        const birthdate = moment(data[1].message).format("YYYY-MM-DD");

        const today = moment().format("YYYY-MM-DD");

        const years = moment().diff(birthdate, "years");

        const adjustToday =
          birthdate.substring(5) === today.substring(5) ? 0 : 1;

        const nextBirthday = moment(birthdate).add(
          years + adjustToday,
          "years"
        );

        const daysUntilBirthday = nextBirthday.diff(today, "days");

        return daysUntilBirthday;
      }

      return "NaN";
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
      const allMessages = await MESSAGE_MODAL.find({}, { _id: 0, __v: 0 });
      res.json({ error: false, info: null, data: allMessages });
    } catch (e) {
      res.json({ error: true, info: e, data: [] });
    }
  };

  getMessageById = async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const message = await MESSAGE_MODAL.findOne({ id }, { _id: 0, __v: 0 });
        if (!isEmpty(message)) {
          res.json({ error: false, info: null, data: message });
        }
        throw new Error("No Message Related to this Id");
      } else {
        throw new Error("Please Send Message Id");
      }
    } catch (e) {
      res.json({ error: true, info: e, data: [] });
    }
  };

  deleteMessageById = async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const deletedMessage = await MESSAGE_MODAL.deleteOne({ id });
        if (!isEmpty(message)) {
          res.json({
            error: false,
            info: null,
            data: { message: "Successfully Deleted" }
          });
        }
        throw new Error("No Message Related to this Id");
      } else {
        throw new Error("Please Send Message Id For Deletion");
      }
    } catch (e) {
      res.json({ error: true, info: e, data: [] });
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
