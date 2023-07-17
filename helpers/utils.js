const checkDate = (start_date, end_date) => {
  const now = new Date();
  start_date = new Date(start_date);
  end_date = new Date(end_date);

  let result = start_date <= now && now <= end_date ? true : false;

  return result;
};

module.exports = {
  checkDate,
};
