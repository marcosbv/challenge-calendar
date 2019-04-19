
// class responsible for the calendar. This will show up a calendar which
// you can schedule appointments. Appoitments can be scheduled by "Schedule" button
// or giving a double-click on the calendar day. Appoitments can be deleted using the 
// "Delete" button and can be changed selecting a new date from calendar and clicking in
// "Set From Calendar" button.
// Author: Marcos Vieira
class Calendar {

    // default constructor
    constructor() {
       this.selectedDate = null;
       this.isRendered = false;
       this.currentDate = null;
       this.selectedMonth = null;
       this.selectedYear = null;
       var currentDate = new Date();
       this.currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0,0,0);
       this.scheduledDates = [];
    }

    // retrieve the number of day for a month and year (in years with 29 days in February)
   daysForMonth(month, year) {
       var daysOfMonth = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
       if(year % 4 == 0 && month == 1) {
           return "29"
       } else {
           return daysOfMonth[month];
       }
   }

   // main method of this class.
   // creates a graphical representation of a calendar. It uses styles from calendar.css to represent
   // selected, disabled and scheduled dates.
   // It receives a Calendar object as a parameter.
   // This method is widely used by this class, so be careful when making changes in it.
   render(objCal) {
  
    // initialize calendar if do not so
    if(!objCal.isRendered) {
        objCal.init();
        objCal.isRendered = true;
     }

     var daysOfSelectedMonth = objCal.daysForMonth(objCal.selectedMonth, objCal.selectedYear);
     var lineNumber = 1;

     // create the calendar dates for specific month / year.
     for(var j=1;j<=daysOfSelectedMonth; j++) {
         
         var date = new Date(objCal.selectedYear, objCal.selectedMonth, j, 0, 0, 0);

         var dayOfWeek = date.getDay();

         var element = document.getElementById("calendar_t" + lineNumber + dayOfWeek);
         element.innerHTML = j;
         
         // go to next line
         if(dayOfWeek==6) {
             lineNumber++;
         }

        // if this date is less than current date/time, disable it in the UI 
        if(objCal.currentDate.getTime() > date.getTime()) {
            element.disabled = "true";
            element.classList.add("disabled");
        } else {
            element.disabled = "false";
            element.classList.remove("disabled");
        }

        // if this date is today, let the border red
        if(objCal.currentDate.getFullYear() == date.getFullYear() &&
                 objCal.currentDate.getMonth() == date.getMonth()  &&
                 objCal.currentDate.getDate() == date.getDate()) {
             element.classList.add("today");
        }

        // if this date is the one selected by user, change its background
        if(objCal.selectedDate != null) {
            if(objCal.selectedDate.getFullYear() == date.getFullYear() &&
                 objCal.selectedDate.getMonth() == date.getMonth() &&
                 objCal.selectedDate.getDate() == date.getDate()) {
                 element.classList.remove("not_selected")
                 element.classList.add("selected");
            } else {
                element.classList.remove("selected");
                element.classList.add("not_selected");
            }
        }

        // if this date is in the scheduled dates array, change its background and let it disabled
        for(var l=0;l<calendar.scheduledDates.length; l++) {
            var scheduledDate = calendar.scheduledDates[l];
            if(scheduledDate.getFullYear() == date.getFullYear() &&
                   scheduledDate.getMonth() == date.getMonth()   &&
                   scheduledDate.getDate() == date.getDate()) {
                element.disabled = "true";
                element.classList.add("scheduled");
            }
        }
     }

     var scheduleButton = document.getElementById("scheduleButton");
     scheduleButton.disabled = "true";

   }

   // Initializes the top part of calendar.
   // It also fulfills the year and month selectors and creates the Scheduled Dates on the right of calendar.  
   init() {
      
       document.write("<div id=\"calendar_component\" width=\"200px\"><div id=\"calendar_div\" ><div><button id=\"previousMonth\" class=\"monthButton\"><<</button><select id=\"monthSelector\"></select><select id=\"yearSelector\"></select>  <button id=\"nextMonth\" class=\"monthButton\">>></button> </div></div></div>");
      
       var table = document.createElement("table");
       table.id = "calendar_table";

       var weekDays = "SMTWTFS"
       // table for calendar
       for(var i=0; i<=6; i++) {
           var row = document.createElement("tr");
           row.id = "calendar_r" + i;

           
           if(i==0) {
               row.className = "table_header";
           }

           for(var j=0;j<7;j++) {
               var table_element = document.createElement("td");
               table_element.id = "calendar_t" + i + j;
               table_element.className = "table_element not_selected";

               if(i==0) {
                   table_element.innerHTML = weekDays.charAt(j);
               }

               row.appendChild(table_element);
               table_element.addEventListener("click", this.selectDate);
               table_element.addEventListener("dblclick", function(e) {
                   calendar.selectDate(e);
                   calendar.scheduleDate(e);
               });
           }
           
           table.appendChild(row);
       }

       var div = document.getElementById("calendar_div");
    //div.style = "display: inline-block";
       div.appendChild(table);

       // load year/month selectors
       this.loadMonths();
       this.loadYears();

       // schedule button
       var scheduleButton = document.createElement("button");
       scheduleButton.innerHTML = "Schedule";
       scheduleButton.classList.add("controlButton");
       scheduleButton.id = "scheduleButton";

       div.appendChild(scheduleButton);

       var divComponent = document.getElementById("calendar_component");
      // divComponent.style.display = "inline-block";
      // divComponent.style.border = "1px solid";
      
       // Scheduled Dates Div and table on the right
       var appointmentDiv = document.createElement("div");
       appointmentDiv.style.display = "inline-block";
       appointmentDiv.style.width = "280px";
       appointmentDiv.style.height = "223px";
       appointmentDiv.style.padding = "10px";
       appointmentDiv.style.backgroundColor = "blue";
       appointmentDiv.style.overflow = "scroll";

       appointmentDiv.innerHTML = "<table id=\"appoitmentTable\" width=\"270px\"><tr><td colspan=\"4\">Scheduled Dates:</td></table>";

       divComponent.appendChild(appointmentDiv);

       // listeners for selectors change
       var monthSelector = document.getElementById("monthSelector");
       monthSelector.addEventListener("change", this.selectMonth);

       var yearSelector = document.getElementById("yearSelector");
       yearSelector.addEventListener("change", this.selectYear);

       scheduleButton.addEventListener("click", this.scheduleDate);

       // listeners for top buttons (<< and >>)
       var previousMonthButton = document.getElementById("previousMonth");
       previousMonthButton.addEventListener("click", this.previousMonth);
       var nextMonthButton = document.getElementById("nextMonth");
       nextMonthButton.addEventListener("click", this.nextMonth);

   }

   // Load months in the month selector
   loadMonths() {
      var monthList = ["Jan", "Feb", "Mar", "Apr" , "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var monthSelect = document.getElementById("monthSelector");
      for(var i=0;i<monthList.length; i++) {
          var option = document.createElement("OPTION");
          option.text = monthList[i];
          option.value = i;

          if(this.currentDate.getMonth() == i) {
              option.selected = "true";
              this.selectedMonth = i;
          }
          monthSelect.appendChild(option);
      }

   }

   // Load years in the year selector (range: current year to 2050)
   loadYears() {
       var yearSelect = document.getElementById("yearSelector");
       var currentYear = this.currentDate.getFullYear();
       for(var i=currentYear ;i<2051; i++) {
           var option = document.createElement("OPTION");
           option.text = i;
           option.value = i;
           if(currentYear == i) {
               option.selected = "true";
               this.selectedYear = i;
           }
           yearSelect.appendChild(option);
        }
    }

    // Event handler for calendar date selection .
    // It changes the 'selectedDate' object into calendar object.
    selectDate(e) {
        var element = e.target;
        
        if(element.className.indexOf("scheduled") != -1) {
            alert("This date was already scheduled. Please use the delete button in the Scheduled Dates list to remove it.");
        } 

        if(element.disabled == "true") {
            return;
        }
        calendar.selectedMonth = document.getElementById("monthSelector").value;
        calendar.selectedYear = document.getElementById("yearSelector").value;
        calendar.selectedDate = new Date(calendar.selectedYear, calendar.selectedMonth, element.innerHTML, 0,0,0);

        calendar.render(calendar);
        var scheduleButton = document.getElementById("scheduleButton");
        scheduleButton.disabled = "";
    }

    // Event Handler for month selector change.
    // Refreshs the calendar to get the right days and week days.
    selectMonth(e) {
        var element = e.target;
        calendar.selectedMonth = element.value;
        calendar.clearFields();
        calendar.render(calendar);
    }

    // Event Handler for year selector change.
    // Refreshs the calendar to get the right days and week days.
    selectYear(e) {
        var element = e.target;
        calendar.selectedYear = element.value;
        calendar.clearFields();
        calendar.render(calendar);
    }

    // Event Handler for schedule button click.
    // It updates the internal scheduledDates array and updates the Schedule List table
    // with the new appointment.
    scheduleDate(e) {
        var selectedDate = calendar.selectedDate;
        var month = selectedDate.getMonth() +1
        var monthStr = month < 10 ? "0" + month : month;
        var date = selectedDate.getDate();
        var dateStr = date < 10 ? "0" + date : date;

        calendar.scheduledDates[calendar.scheduledDates.length]=selectedDate;
        calendar.selectedDate = null;

        var table = document.getElementById("appoitmentTable");
        var row = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.colSpan = "3";
        td1.innerHTML = dateStr + "-" + monthStr + "-" + selectedDate.getFullYear();

        // button Set From Calendar
        var td11 = document.createElement("td");
        td11.colSpan = "1";
        td11.innerHTML = "Set From Calendar";
        td11.style.color = "lightgreen";
        td11.style.border = "1px solid lightgreen";
        td11.style.borderRadius = "10%";
        td11.addEventListener("click", calendar.setNewSchedule);

        // button Delete
        var td2 = document.createElement("td");
        td2.colSpan = "1";
        td2.innerHTML = "Delete";
        td2.style.color = "darkorange";
        td2.style.border = "1px solid darkorange";
        td2.style.borderRadius = "10%";

        td2.addEventListener("click", calendar.removeSchedule);


        row.appendChild(td1);
        row.appendChild(td11);
        row.appendChild(td2);

        table.appendChild(row);
        calendar.render(calendar);

    }

    // Event Handler for schedule removal, when an user clicks in the delete button for a schedule.
    // Remove this entry from scheduledDates list and from Scheduled Dates list.
    // It also refreshs the calendar to remove this appointment from that.
    removeSchedule(e) {
        if(!confirm("Are you sure you want to delete this schedule? ")) {
            return;
        }
        var row = e.target.parentNode;
        var table = document.getElementById("appoitmentTable");

        for(var z=0;z<table.rows.length;z++) {
            if(row == table.rows[z]) {
                table.deleteRow(z);
                calendar.scheduledDates.splice(z-1, 1);
                break;
            }
        }

        calendar.clearFields();
        calendar.render(calendar);
        
    }

    // Event handler for setting new date from Calendar.
    // A new date must be selected from calendar before clicking "Set From Calendar" button.
    // It updates the scheduledDates array and Schedule Dates list with the selected date.
    setNewSchedule(e) {
      
        if(calendar.selectedDate==null) {
            alert("To Set a new date for this appoitment, please select a new one from the calendar");
            return;
        }
        var row = e.target.parentNode;
        var table = document.getElementById("appoitmentTable");

        for(var z=0;z<table.rows.length;z++) {
            if(row == table.rows[z]) {
                var dateCell = row.cells[0];

                var selectedDate = calendar.selectedDate;
                var month = selectedDate.getMonth() +1
                var monthStr = month < 10 ? "0" + month : month;
                var date = selectedDate.getDate();
                var dateStr = date < 10 ? "0" + date : date;
                dateCell.innerHTML = dateStr + "-" + monthStr + "-" + selectedDate.getFullYear();
                calendar.scheduledDates[z-1] = selectedDate;
                calendar.selectedDate = null;
                break;
            }
        }

        calendar.clearFields();
        calendar.render(calendar);
        
    }

    // Clear all values and styles from dynamic part of calendar.
    clearFields() {
        for(var i=1;i<=6;i++) {
           for(var j=0;j<7;j++) {
               var elem = document.getElementById("calendar_t" + i + j);
               elem.innerHTML = "";
               elem.classList.remove("selected");
               elem.classList.remove("today");
               elem.classList.remove("scheduled");
           }
        }
    }

    // Event handler for << button.
    // Updates the calendar with previous month layout.
    previousMonth(e) {
        var monthSelector = document.getElementById("monthSelector").options;
        for(var i=0;i<monthSelector.length;i++) {
            var option = monthSelector[i];
            if(option.selected) {
                if(i==0 && calendar.selectedYear != calendar.currentDate.getFullYear()) {
                    calendar.previousYear();
                    monthSelector[11].selected = "true";
                    calendar.selectedYear = calendar.selectedYear - 1;
                    calendar.selectedMonth = monthSelector[11].value;
                } else {
                    monthSelector[i-1].selected = "true";
                    calendar.selectedMonth = monthSelector[i-1].value;
                }


                break;
            }
        }

       
        calendar.clearFields();
        calendar.render(calendar);
    }

    // Event handler for >> button.
    // Updates the calendar with next month layout.
    nextMonth(e) {
        var monthSelector = document.getElementById("monthSelector").options;
        for(var i=0;i<monthSelector.length;i++) {
            var option = monthSelector[i];
            if(option.selected) {
                if(i==11) {
                    calendar.nextYear();
                    monthSelector[0].selected = "true";
                    calendar.selectedYear = calendar.selectedYear + 1;
                    calendar.selectedMonth = monthSelector[0].value;
                } else {
                    monthSelector[i+1].selected = "true";
                    calendar.selectedMonth = monthSelector[i+1].value;
                }


                break;
            }
        }

        calendar.clearFields();
        calendar.render(calendar);
    }

    // Set the previous year in the UI
    previousYear() {
        var yearSelector = document.getElementById("yearSelector").options;
        for(var i=0;i<yearSelector.length;i++) {
            var option = yearSelector[i];
            if(option.selected) {
                if(i>0) {
                    yearSelector[i-1].selected = "true";
                }

                break;
            }
        }
    }

    // Set the next year in the UI
    nextYear() {
        var yearSelector = document.getElementById("yearSelector").options;
        for(var i=0;i<yearSelector.length;i++) {
            var option = yearSelector[i];
            if(option.selected) {
                if(i<yearSelector.length - 1) {
                    yearSelector[i+1].selected = "true";
                    break;
                } 
            }
        }
    }

}

// object instance
var calendar = new Calendar();
// first rendering
calendar.render(calendar);