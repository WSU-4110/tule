class DateHandler{
    dateToSchedKey(date) {
        // Extracting month, day, and year from the Date object
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var year = String(date.getFullYear());
      
        // Concatenating the month, day, and year in the required format
        var schedKey = month + day + year;
      
        return schedKey;
      }

      schedKeyToDate(schedKey) {
        // Extracting month, day, and year from the input string
        var month = parseInt(schedKey.substr(0, 2));
        var day = parseInt(schedKey.substr(2, 2));
        var year = parseInt(schedKey.substr(4, 4));
      
        // Creating a new Date object with the extracted month, day, and year
        var date = new Date(year, month - 1, day);
      
        return date;
      }
}

module.exports = DateHandler