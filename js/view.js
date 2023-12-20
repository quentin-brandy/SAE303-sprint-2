import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

let V = {};

V.uicalendar = new Calendar('#calendar', {
  defaultView: 'week',
  isReadOnly: true,
  usageStatistics: false,
  useDetailPopup: true,
  week: {
    startDayOfWeek: 1,
    dayNames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    workweek: true,
    hourStart: 8,
    hourEnd: 20,
    taskView: false,
    eventView: ['time'],
  },
  template: {
    time: function(event) {
      return `<span style="color: white;">${event.title}</span>`;
    }
  },
 
 
});

V.colorMap = {
  "mmi1": {CM: "#88AB8E", TD: "#66826A", TP: "#38473A", OTHER: "#88AB8E"},
  "mmi2": {CM: "#EEC759", TD: "#A88C3F", TP: "#5A4B22", OTHER: "#EEC759"},
  "mmi3": {CM: "#8ACDD7", TD: "#63939A", TP: "#3F5E63", OTHER: "#8ACDD7"}
}

V.hourStart = function(para) {
  let heure = para.start.toString();
  let test = heure.slice(16, -42);
  test = test.replaceAll(":", ".");
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
};

V.hourEnd = function(para) {
  let heure = para.end.toString();
  let test = heure.slice(16, -42);
  test = test.replaceAll(":", ".");
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
}
V.addoption = function(personnes){
  let selectElement = document.getElementById("intervenant");
personnes.forEach(personne => {
  let option = document.createElement("option");
  option.value = personne;
  option.text = personne;
  selectElement.appendChild(option);
});
}
export { V };