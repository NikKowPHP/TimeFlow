export function dateUtils(){

// Converts a date string in the format "MM/DD/YYYY" to "YYYY-MM-DD" (MySQL format).
  function convertDateSql(date) {
    if (typeof date === "string" && date !== "") {
      const dateArr = date.split("/");
      const year = dateArr[2];
      const month = dateArr[0].padStart(2, "0");
      const day = dateArr[1].padStart(2, "0");
      const mysqlDate = `${year}-${month}-${day}`;

      return mysqlDate;
    }
  }
	return {
		convertDateSql,
	}
}