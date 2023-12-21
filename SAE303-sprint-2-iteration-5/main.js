import { M } from "./js/model.js";
import { V } from "./js/view.js";

/*
   Ce fichier correspond au contrôleur de l'application. Il est chargé de faire le lien entre le modèle et la vue.
   Le modèle et la vue sont définis dans les fichiers js/model.js et js/view.js et importés (M et V, parties "publiques") dans ce fichier.
   Le modèle contient les données (les événements des 3 années de MMI).
   La vue contient tout ce qui est propre à l'interface et en particulier le composant Toast UI Calendar.
   Le principe sera toujours le même : le contrôleur va récupérer les données du modèle et les passer à la vue.
   Toute opération de filtrage des données devra être définie dans le modèle.
   Et en fonction des actions de l'utilisateur, le contrôleur pourra demander au modèle de lui retourner des données filtrées
   pour ensuite les passer à la vue pour affichage.

   Exception : Afficher 1, 2 ou les 3 années de formation sans autre filtrage peut être géré uniquement au niveau de la vue.
   */


// loadind data (and wait for it !)
await M.init();


// ~~~~IT 1~~~~

let MmiAll = [...M.getEvents('mmi1'), ...M.getEvents('mmi2'), ...M.getEvents('mmi3')];



// ~~~~IT 3~~~~

for (const elt of MmiAll) {
  elt.backgroundColor = V.colorMap[elt.calendarId][elt.type];
}




let personnes = [
  "MOUTAT Audrey",
  "MORA Frédéric",
  "ADAMCZYK Natacha",
  "GUEDIRA Réda",
  "LAVEFVE Valérie",
  "SPRINGINSFELD Denis",
  "CRESPIN Benoit",
  "ADAM Fabrice",
  "AYMARD Adrien",
  "AYMARD Alain",
  "BABIN Valentin",
  "BONNAUD Lucile",
  "BERTHIER Hélène",
  "CHANTELOUP Amelin",
  "CREDEVILLE Maxime",
  "CHUPIN Suzanne",
  "DAL BELLO Marine",
  "DEMAISON Guillaume",
  "DULAC Benoit",
  "DUBREUIL Anne-Sophie",
  "FEYDI Philippe",
  "FIAMMETTI Deborah",
  "FLITTI Eric",
  "GERAUD Fabien",
  "GOUDARD Bérénice",
  "GRASSET Véronique",
  "JARDOU Thomas",
  "JAUFFRET Manon",
  "JOUY Maxime",
  "LAFONT Mathieu",
  "LASCAUD Raphaël",
  "LAZARE Jean-Cédric",
  "LE BAIL Emma",
  "LECOMTE Catherine",
  "MARTY Thomas",
  "MONDOLLOT Rémi",
  "MINIER Jules",
  "NENIN Cédric",
  "PAILLIER Stéphane",
  "PINAUD Anaïs",
  "PORRO Heinich",
  "PORTAL Nicolas",
  "SABOURIN Erwan",
  "SINCLAIR Diego",
  "THARAUD Sébastien",
  "TZVETKOVA Maria",
  "TURBELIN Pierre",
  "VALETTE Sophie",
  "LU Inès",
  "KABAB Simon",
  "VEILLON Pascal",
];


// itération 3 select
V.addoption(personnes);


let dataintervenantheure = [];
let prof = {};
let allevent = MmiAll; 
for (let intervenant of personnes) {
   prof[intervenant] = allevent.filter((event) => { return event.title.includes(intervenant) })
}



let allintervenant = function(intervenant) {
  let sunburstdata = [];
  let intervenantevent = allevent.filter((event) => {
    return event.title.includes(intervenant);
  });
console.log(intervenantevent);
  let intervenantData = {
    name: intervenant,
    children: []
  };
  for (let i = 1; i <= 6; i++) {
    let semestreEvents = intervenantevent.filter((event) => {
      return event.semestre.includes(i.toString());
    });

    let semestreData = {
      name: "semestre" + i,
      children: []
    };

    let ressources = [];
    semestreEvents.forEach(event => {
      if (ressources.indexOf(event.ressource) === -1) {
        ressources.push(event.ressource);
      }
    });
   
    for (let res of ressources) {
      let calcCM = 0;
      let calcTD = 0;
      let calcTP = 0;
      let calcOther = 0;
      let ressourceEvents = semestreEvents.filter((event) => {
        return event.ressource === res;
      });
      for (const event of ressourceEvents) {
        
        if (event.type == "CM") {
          calcCM += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "TD") {
          calcTD += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "TP") {
          calcTP += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "OTHER") {
          calcOther += V.hourEnd(event) - V.hourStart(event);
        }
      
      }
      let ressourceData = {
        name: res,
        children: [
          {
            name: "CM",
            value: calcCM
          },
          {
            name: "TD",
            value:  calcTD
          },
          {
            name: "TP",
            value:  calcTP
          },
          {
            name: "OTHER",
            value:  calcOther
          },
        ]
      };

      semestreData.children.push(ressourceData);
    }

    intervenantData.children.push(semestreData);
  }

  sunburstdata.push(intervenantData);
  console.log(sunburstdata);  
  return sunburstdata;
}





// itération 2

am5.ready(function() {

  // Create chart
  var root = am5.Root.new("chartdiv2");
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panY",
    wheelY: "zoomY",
    paddingLeft: 0,
    layout: root.verticalLayout,
  }));
  
  chart.plotContainer.get("background").setAll({       
    stroke: am5.color("#2C3E50"),
    strokeOpacityOpacity: 1,                     
    fill: am5.color("#ffffff"),
    fillOpacity: 1
  });


  // Add scrollbar
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  chart.set("scrollbarY", am5.Scrollbar.new(root, {
    orientation: "vertical",
  }));




  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var yRenderer = am5xy.AxisRendererY.new(root, {});
  var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "intervenant",
    renderer: yRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  yRenderer.grid.template.setAll({
    location: 1
  })
  let affichageYaxis = function(data){
    yAxis.data.setAll(data);
  };
  

  
  var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
    min: 0,
    maxPrecision: 0,
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 40,
      strokeOpacity: 0.1
    })
  }));

  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  var legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));

  chart.get("colors").set("colors", [
    am5.color("#E74C3C"),
    am5.color("#5dade2"),
    am5.color("#2a84bf"),
  ]);
  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  function makeSeries(name, fieldName) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      baseAxis: yAxis,
      valueXField: fieldName,
      categoryYField: "intervenant"
    }));

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryY}: {valueX}",
      tooltipY: am5.percent(10)
    });
    let affichageserie = function(data){
      series.data.setAll(data);
    };
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/

    
// itération 2
    let semestre = document.querySelector("#semestre");
    let handlersemestre = function (ev) {
      for (let intervenant of personnes) {
        let calcCM = 0;
        let calcTD = 0;
        let calcTP = 0;
        let calcOther = 0;
        if(ev.target.value === "0"){
          for (const event of prof[intervenant]) {
              if (event.type == "CM") {
                calcCM += V.hourEnd(event) - V.hourStart(event);
              }
              else if (event.type == "TD") {
                calcTD += V.hourEnd(event) - V.hourStart(event);
              }
              else if (event.type == "TP") {
                calcTP += V.hourEnd(event) - V.hourStart(event);
              }
              else {
                calcOther += V.hourEnd(event) - V.hourStart(event);
              }
          }
          let a = {
            "intervenant": intervenant,
            "CM": calcCM,
            "TD": calcTD,
            "TP": calcTP,
          };
          dataintervenantheure.push(a);
        }
      else{
        for (const event of prof[intervenant]) {
          if (ev.target.value === event.semestre[0]) {
            if (event.type == "CM") {
              calcCM += V.hourEnd(event) - V.hourStart(event);
            }
            else if (event.type == "TD") {
              calcTD += V.hourEnd(event) - V.hourStart(event);
            }
            else if (event.type == "TP") {
              calcTP += V.hourEnd(event) - V.hourStart(event);
            }
            else {
              calcOther += V.hourEnd(event) - V.hourStart(event);
            }
          }
        }
        let a = {
          "intervenant": intervenant,
          "CM": calcCM,
          "TD": calcTD,
          "TP": calcTP,
        };
        dataintervenantheure.push(a);
      }
      }
     console.log(dataintervenantheure)
     affichageserie(dataintervenantheure);
     affichageYaxis(dataintervenantheure);
      dataintervenantheure = [];
    }
    semestre.addEventListener("change", handlersemestre);
    handlersemestre({ target: { value: "0" } })

    series.appear();

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          fill: root.interfaceColors.get("alternativeText"),
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true
        })
      });
    });

    legend.data.push(series);
  }
  

  makeSeries("CM", "CM");
  makeSeries("TD", "TD");
  makeSeries("TP", "TP");




// itération 3


// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

var myTheme = am5.Theme.new(root);

myTheme.rule("ColorSet").set("colors", [
  am5.color("#3498db"),
  am5.color("#2ecc71"),
  am5.color("#e74c3c"),
  am5.color("#D5BE0A"),
  am5.color("#9b59b6"),
  am5.color("#2c3e50"),
  am5.color("#1abc9c"),
]);
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create wrapper container
var container = root.container.children.push(am5.Container.new(root, {
  width: am5.percent(100),
  height: am5.percent(100),
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
var series = container.children.push(am5hierarchy.Sunburst.new(root, {
  singleBranchOnly: true,
  downDepth: 10,
  initialDepth: 10,
  valueField: "value",
  categoryField: "name",
  childDataField: "children"
}));


// Generate and set data
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data


// itération 3

let intervenant = document.querySelector("#intervenant");
let handlerintervenant = function(ev){
  let intervenant = ev.target.value;
  let cours = allintervenant(intervenant);
  affichagedonut(cours);    
}


let affichagedonut = function(data){
  series.data.setAll(data);
};

handlerintervenant({ target: { value: "MOUTAT Audrey" } });

series.set("selectedDataItem", series.dataItems[0]);

container.children.unshift(
  am5hierarchy.BreadcrumbBar.new(root, {
    series: series
  })
);


// itération 4

var root = am5.Root.new("chartdiv3");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "none",
  wheelY: "none",
  paddingLeft: 0,
  layout: root.verticalLayout
}));


// Create axes and their renderers
var yRenderer = am5xy.AxisRendererY.new(root, {
  visible: false,
  minGridDistance: 20,
  inversed: true,
  minorGridEnabled: true
});

yRenderer.grid.template.set("visible", false);

var yAxisheatmap = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  renderer: yRenderer,
  categoryField: "hour"
}));

var xRenderer = am5xy.AxisRendererX.new(root, {
  visible: false,
  minGridDistance: 30,
  opposite:true,
  minorGridEnabled: true
});

xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  renderer: xRenderer,
  categoryField: "weekday"
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
var serieheatmap = chart.series.push(am5xy.ColumnSeries.new(root, {
  calculateAggregates: true,
  stroke: am5.color(0xffffff),
  clustered: false,
  xAxis: xAxis,
  yAxis: yAxisheatmap,
  categoryXField: "weekday",
  categoryYField: "hour",
  valueField: "value"
}));

serieheatmap.columns.template.setAll({
  tooltipText: "{value}",
  strokeOpacity: 1,
  strokeWidth: 2,
  width: am5.percent(100),
  height: am5.percent(100)
});

serieheatmap.columns.template.events.on("pointerover", function(event) {
  var di = event.target.dataItem;
  if (di) {
    heatLegend.showValue(di.get("value", 0));
  }
});

serieheatmap.events.on("datavalidated", function() {
  heatLegend.set("startValue", serieheatmap.getPrivate("valueHigh"));
  heatLegend.set("endValue", serieheatmap.getPrivate("valueLow"));
});



// Set up heat rules
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
serieheatmap.set("heatRules", [{
  target: serieheatmap.columns.template,
  min: am5.color(0xfffb77),
  max: am5.color(0xfe131a),
  dataField: "value",
  key: "fill",
}]);


// Add heat legend
// https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/
var heatLegend = chart.bottomAxesContainer.children.push(am5.HeatLegend.new(root, {
  orientation: "horizontal",
  endColor: am5.color(0xfffb77),
  startColor: am5.color(0xfe131a)
}));

// itération 4

let dataheatmap = [];

let handlerheatmap = function(ev) {
  let intervenant = ev.target.value; 

  let filteredEvents = allevent.filter((event) => {
    return event.title.includes(intervenant);
  });

  function getdayfromdate(date) {
    let jours = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let dayIndex = date.getDay() - 1;
    return jours[dayIndex];
  }

  let totalheure = {};

  let joursemaine = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri',];
  joursemaine.forEach(jour => {
    totalheure[jour] = []; 

    let eventjour = filteredEvents.filter(event => {
      const eventDay = getdayfromdate(event.start);
      return eventDay === jour;
    });

    eventjour.forEach(event => {
      for (let heure = 0; heure < 24; heure++) {
        let intersection = V.intersectByHour(heure, event.start, event.end);

        let heurefinal = `${heure}h`;

        if (!totalheure[jour][heurefinal]) {
          totalheure[jour][heurefinal] = { hour: heurefinal, weekday: jour, value: 0 };
        }

        totalheure[jour][heurefinal].value += intersection;
      }
    });

    dataheatmap = dataheatmap.concat(Object.values(totalheure[jour]));

  });
  affichageheatmap(dataheatmap);
  console.log(dataheatmap);
  dataheatmap = [];
};
intervenant.addEventListener("change", handlerintervenant);
intervenant.addEventListener("change", handlerheatmap);


// Set data
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data
let affichageheatmap = function(data){
  serieheatmap.data.setAll(data);
};
handlerheatmap({ target: { value: "MOUTAT Audrey" } });
xAxis.data.setAll([
  { weekday: "Mon" },
  { weekday: "Tue" },
  { weekday: "Wed" },
  { weekday: "Thu" },
  { weekday: "Fri" },
]);

yAxisheatmap.data.setAll([
  { hour: "8h" },
  { hour: "9h" },
  { hour: "10h" },
  { hour: "11h" },
  { hour: "12h" },
  { hour: "13h" },
  { hour: "14h" },
  { hour: "15h" },
  { hour: "16h" },
  { hour: "17h" },
  { hour: "18h" },
  { hour: "19h" },
]);


// Make stuff animate on load
serieheatmap.appear(1000, 100);

}); // end am5.ready()
