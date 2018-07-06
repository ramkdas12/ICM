(function () {
  var widgetElement = document.getElementsByClassName("widget-container")[0];
  var currentData = [];
  var firstCall = function () {
    setInterval(getData, 500);
    //getData();
  }
  function getData() {
    var url = "http://webrates.truefx.com/rates/connect.html?f=csv";
    var http;
    if (window.XMLHttpRequest) {
      http = new XMLHttpRequest();
    } else {
      try {
        http = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          http = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {

        }
      }
    }
    if (http) {
      http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          formatData(this.responseText);
        }
      };
      http.open("GET", url, true);
      http.send();
    }
  }

  function formatData(data) {
    var tableData = data.split("\n");
    tableData.splice(tableData.length - 2, 2);
    var formattedData = [];
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].indexOf(",") >= 0) {
        tableData[i] = tableData[i].split(",");
      }
    }
    tableData.sort();
    for (var i = 0; i < tableData.length; i++) {
      formattedData[i] = {};
      formattedData[i]["forex"] = tableData[i][0];
      formattedData[i]["bidPrice"] = tableData[i][2] + tableData[i][3];
      formattedData[i]["askPrice"] = tableData[i][4] + tableData[i][5];
      formattedData[i]["spreadValue"] = (parseFloat(formattedData[i]["askPrice"]).toFixed(5) - parseFloat(formattedData[i]["bidPrice"]).toFixed(5)).toFixed(5);
      formattedData[i]["tickTime"] = getFormattedTime(tableData[i][1]);
    }
    if (currentData.length === 0) {
      currentData = formattedData;
      loadTemplate();
    } else {
      compareData(formattedData);
    }
  }

  function getFormattedTime(newTime) {
    var currDate = new Date(parseInt(newTime));
    return currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getMilliseconds();
  }

  function loadTemplate() {
    var containerWidth = widgetElement.clientWidth;
    var dataDiv = document.createElement("div");
    dataDiv.className = "dataDiv";
    dataDiv.setAttribute("style", "width: 100%");
    for (var i = 0; i < currentData.length; i++) {
      var wrapperDiv = document.createElement("div");
      wrapperDiv.className = "wrapperDiv";
      wrapperDiv.setAttribute("style", "width: 100%");

      var forexDiv = document.createElement("div");
      forexDiv.setAttribute("id", "forexDiv_" + i);
      forexDiv.className = "forexDiv";
      forexDiv.innerText = currentData[i]["forex"];
      if (containerWidth > 600) {
        forexDiv.setAttribute("style", "width: 20%");
      } else if (containerWidth > 400) {
        forexDiv.setAttribute("style", "width: 33%");
      } else {
        forexDiv.setAttribute("style", "width: 100%");
      }

      var pricingDiv = document.createElement("div");
      pricingDiv.setAttribute("id", "pricingDiv_" + i);
      pricingDiv.className = "pricingDiv noChange";
      if (containerWidth > 600) {
        pricingDiv.setAttribute("style", "width: 40%");
      } else if (containerWidth > 400) {
        pricingDiv.setAttribute("style", "width: 33%");
      } else {
        pricingDiv.setAttribute("style", "width: 100%");
      }
      var askPrice = document.createElement("div");
      askPrice.setAttribute("id", "askPrice_" + i);
      askPrice.className = "askPrice noChange";
      askPrice.innerText = currentData[i]["askPrice"];
      if (containerWidth > 600) {
        askPrice.setAttribute("style", "width: 50%");
      } else {
        askPrice.setAttribute("style", "width: 100%");
      }
      var bidPrice = document.createElement("div");
      bidPrice.setAttribute("id", "bidPrice_" + i);
      bidPrice.className = "bidPrice noChange";
      bidPrice.innerText = currentData[i]["bidPrice"];
      if (containerWidth > 600) {
        bidPrice.setAttribute("style", "width: 50%");
      } else {
        bidPrice.setAttribute("style", "width: 100%");
      }
      pricingDiv.appendChild(bidPrice);
      pricingDiv.appendChild(askPrice);

      var otherDiv = document.createElement("div");
      otherDiv.setAttribute("id", "otherDiv_" + i);
      otherDiv.className = "otherDiv";
      if (containerWidth > 600) {
        otherDiv.setAttribute("style", "width: 40%");
      } else if (containerWidth > 400) {
        otherDiv.setAttribute("style", "width: 33%");
      } else {
        otherDiv.setAttribute("style", "width: 100%");
      }
      var spreadValue = document.createElement("div");
      spreadValue.setAttribute("id", "spreadValue_" + i);
      spreadValue.className = "spreadValue noChange";
      spreadValue.innerText = currentData[i]["spreadValue"];
      if (containerWidth > 600) {
        spreadValue.setAttribute("style", "width: 50%");
      } else {
        spreadValue.setAttribute("style", "width: 100%");
      }
      var tickTime = document.createElement("div");
      tickTime.setAttribute("id", "tickTime_" + i);
      tickTime.className = "tickTime noChange";
      tickTime.innerText = currentData[i]["tickTime"];
      if (containerWidth > 600) {
        tickTime.setAttribute("style", "width: 50%");
      } else {
        tickTime.setAttribute("style", "width: 100%");
      }
      otherDiv.appendChild(spreadValue);
      otherDiv.appendChild(tickTime);

      wrapperDiv.appendChild(forexDiv);
      wrapperDiv.appendChild(pricingDiv);
      wrapperDiv.appendChild(otherDiv);

      dataDiv.appendChild(wrapperDiv);
    }
    widgetElement.appendChild(dataDiv);
  }

  function compareData(data) {
    for (var i = 0; i < currentData.length; i++) {
      for (var x in currentData[i]) {
        var currElement = document.getElementById(x + "_" + i);
        if (x !== "forex" && x !== "tickTime") {
          var eleId = x + "_" + i;
          if (parseFloat(currentData[i][x]) > parseFloat(data[i][x])) {
            removeClass(eleId, "noChange");
            removeClass(eleId, "increase");
            addClass(eleId, "decrease");
            currElement.innerText = parseFloat(data[i][x]);
          } else if (parseFloat(currentData[i][x]) < parseFloat(data[i][x])) {
            removeClass(eleId, "noChange");
            removeClass(eleId, "decrease");
            addClass(eleId, "increase");
            currElement.innerText = parseFloat(data[i][x]);
          } else {
            removeClass(eleId, "decrease");
            removeClass(eleId, "increase");
            addClass(eleId, "noChange");
          }
        }
        if (x === "tickTime") {
          if (currentData[i][x] > data[i][x]) {
            removeClass(eleId, "noChange");
            removeClass(eleId, "increase");
            addClass(eleId, "decrease");
            currElement.innerText = data[i][x];
          } else if (currentData[i][x] < data[i][x]) {
            removeClass(eleId, "noChange");
            removeClass(eleId, "decrease");
            addClass(eleId, "increase");
            currElement.innerText = data[i][x];
          } else {
            removeClass(eleId, "decrease");
            removeClass(eleId, "increase");
            addClass(eleId, "noChange");
          }
        }
      }
    }
    currentData = data;
  }

  function addClass(id, className) {
    try {
      var element = document.getElementById(id);
      if (!element.classList.contains(className)) {
        element.classList.add(className);
      }
    } catch (e) {

    }
  }

  function removeClass(id, className) {
    try {
      var element = document.getElementById(id);
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      }
    } catch (e) {

    }
  }

  firstCall();
})();