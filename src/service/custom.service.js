const custom = () => {
  noMatchingUrl = (req, res) => {
    res.send("You have reached a dead end");
  };
  return {
    noMatchingUrl
  };
};
module.exports = custom;
