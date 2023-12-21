let V = {};

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
V.intersectByHour = function (hour, start, end) {

  let interStart = new Date(start);
  interStart.setHours(hour);
  interStart.setMinutes(0);
  let interEnd = new Date(end);
  interEnd.setHours(hour + 1);
  interEnd.setMinutes(0);

  // maintenant il faut déterminer s'il existe une intersection entre [interStart, interEnd] et les horaires du cours [start, end]

  if (interEnd <= start) // si l'heure de fin est avant l'heure de début du cours, pas d'intersection
    return 0;
  else if (interStart >= end) // si l'heure de début est après l'heure de fin du cours, pas d'intersection
    return 0;
  else { // il existe une intersection entre [interStart, interEnd] et les horaires du cours [start, end]
    return (Math.min(interEnd, end) - Math.max(interStart, start)) / 1000 / 3600;
    // on prend le minimum des deux heures de fin et le maximum des deux heures de début
    // et on retourne la durée de l'intersection en heures
  }

}
export { V };