/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */

/* STUDENT APPLICATION */

var model = {
  init: function() {
    //if (!localStorage.attendance) {
    // Disabled so it always runs:
    if (true) {
      console.log('Creating attendance records...');

      function getRandom() {
        return (Math.random() >= 0.5);
      }

      var nameColumns = $('tbody .name-col'),
        attendance = {};

      nameColumns.each(function() {
        var name = this.innerText;
        attendance[name] = [];

        for (var i = 0; i <= 11; i++) {
          attendance[name].push(getRandom());
        }
      });

      localStorage.attendance = JSON.stringify(attendance);
    }

    model.attendence = JSON.parse(localStorage.attendance);
  }
};

/*--- Controller --- */

var controller = {

  init: function() {
    model.init();
    view.init();
    controller.countMissing();
  },

  getStudents: function() {
    return model.attendence;
  },

  getNumOfDays: function() {
    return model.attendence[Object.keys(model.attendence)[0]];
  },

  getAttendence: function(student) {
    return controller.getStudents()[student];
  },

  updateLS: function($studentRows) {
    var newAttendance = {};

    $studentRows.each(function() {
      var studentName = $(this).children('.name-col').text(),
        studentCheckboxes = $(this).children('td').children('input');

      newAttendance[name] = [];

      studentCheckboxes.each(function() {
        newAttendance[name].push($(this).prop('checked'));
      });

    });
    console.log(newAttendance);
    localStorage.attendance = JSON.stringify(newAttendance);
  },

  checkBoxes: function() {
    // Check boxes, based on attendace records
    $.each(model.attendence, function(name, days) {
      var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
        dayChecks = $(studentRow).children('.attend-col').children('input');

      dayChecks.each(function(i) {
        $(this).prop('checked', days[i]);
      });
    });
  },

  countMissing: function() {

    // Count a student's missed days
    view.$allMissed.each(function() {
      var studentRow = $(this).parent('tr'),
        dayChecks = $(studentRow).children('td').children('input'),
        numMissed = 0;

      dayChecks.each(function() {
        if (!$(this).prop('checked')) {
          numMissed++;
        }
      });

      $(this).text(numMissed);
    });
  }
};

var view = {
  init: function() {

    // Add # of days to attendence sheet based on data model
    $.each(controller.getNumOfDays(), function(i) {
      $('#attendence-table thead .missed-col').before('<th>' + (i + 1) + '</th>');
    });

    // Add students to attendence sheet
    $.each(controller.getStudents(), function(student) {
      $('#attendence-table tbody').append('<tr class="student"></tr>');
      $('#attendence-table tbody tr').last().append('<td class="name-col">' + student + '</td>');
      $.each(controller.getAttendence(student), function() {
        $('#attendence-table tbody tr').last().append('<td class="attend-col"><input type="checkbox"></td>');
      });
      $('#attendence-table tbody tr').last().append('<td class="missed-col"></td>');
    });

    view.$allMissed = $('tbody .missed-col');
    view.$allCheckboxes = $('tbody input');
    view.$studentRows = $('tbody .student');

    // Fill out attendence
    controller.checkBoxes();


    // Count missing days
    controller.countMissing();

    // When a checkbox is clicked, update localStorage
    // Me: This is inefficient. When a checkbox is clicked, the whole attendence sheet is checked
    // It should only update the student.
    view.$allCheckboxes.on('click', function() {
      controller.updateLS(view.$studentRows);
      controller.countMissing();
    });
  }
};

controller.init();
