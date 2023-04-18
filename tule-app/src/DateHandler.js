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
        if(schedKey != null){
          var month = parseInt(schedKey.substring(0, 2));
          var day = parseInt(schedKey.substring(2, 4));
          var year = parseInt(schedKey.substring(4, 8));
          // Creating a new Date object with the extracted month, day, and year
          var date = new Date(year, month - 1, day);
          //console.log(date);
        }
        else{
          var date = new Date();
        }
        
      
        return date;
      }
}

module.exports = DateHandler