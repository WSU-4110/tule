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
}

module.exports = DateHandler