const dayjs = require("dayjs");
require("dayjs/locale/fr"); 

dayjs.locale("fr"); 

function formatDate(dateString) {
  return dayjs(dateString).format("dddd D MMMM YYYY");
}

module.exports = { formatDate };




