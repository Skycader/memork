if (
  document.querySelector(".plusDate").attributes.startDate.textContent.length ==
  0
) {
  document.querySelector(".plusDate").attributes.startDate.textContent =
    Date.now();
}

let planner = {
  scrollIntoView: () => {
    let dates = document.querySelectorAll(".date");
    for (var i = 0; i < dates.length; i++) {
      if (dates[i].innerHTML == planner.getDate()) {
        dates[i].scrollIntoView();
        if (i > 0) dates[i - 1].style.background = "";
        dates[i].style.background = "red";
        break;
      }
    }
  },
  highLight: () => {
    let dates = document.querySelectorAll(".date");
    for (var i = 0; i < dates.length; i++) {
      if (dates[i].innerHTML == planner.getDate()) {
        if (i > 0) dates[i - 1].style.background = "";
        dates[i].style.background = "red";
        break;
      }
    }
  },

  newDay: (date) => {
    return date != planner.getDate() ? true : false;
  },

  highLightNewDay: () => {
    if (planner.newDay(today)) {
      today = planner.getDate();
      planner.highLight();
    }
  },
  save: () => {
    if (planner.allowSave) {
      let save = document.querySelector(".root").innerHTML;
      localStorage.setItem("save", save);
    }
  },
  load: () => {
    let element = document.querySelector(".root");
    let save = localStorage.getItem("save");

    element.innerHTML = save;
  },
  getDate: () => {
    let dateString = new Date().toString().split(" ");
    dateString = dateString[2] + " " + dateString[1] + " " + dateString[3];
    return dateString;
  },
  addDate: () => {
    let dates = document.querySelectorAll(".date").length - 1;
    let startDate =
      document.querySelector(".plusDate").attributes.startDate.textContent * 1;
    let inner = startDate + dates * 24 * 60 * 60 * 1000;
    let theDate = new Date(inner).toString();
    theDate = theDate.split(" ");
    theDate = theDate[2] + " " + theDate[1] + " " + theDate[3];
    document
      .querySelector(".plusDate")
      .insertAdjacentHTML(
        "beforebegin",
        "<div oncontextmenu='planner.dateWider(this,0); return false;' onclick='planner.dateWider(this,1)' class='date'>" +
          theDate +
          "</div>"
      );
    planner.highLight();
  },
  addTask: (element, where) => {
    if (!element && !where) {
      let inner = document.querySelector(".taskExample").innerHTML;
      document
        .querySelector(".plusTask")
        .insertAdjacentHTML(
          "beforebegin",
          "<div done='0' class='task'>" + inner + "</div>"
        );
    } else {
      let inner = document.querySelector(".taskExample").innerHTML;
      if (where == 1) {
        element.parentElement.insertAdjacentHTML(
          "beforebegin",
          "<div done='0' class='task'>" + inner + "</div>"
        );
      } else {
        element.parentElement.insertAdjacentHTML(
          "afterend",
          "<div done='0' class='task'>" + inner + "</div>"
        );
      }
    }
  },
  addFailure: () => {
    let inner = document.querySelector(".taskExample").innerHTML;
    document
      .querySelector(".tasks")
      .insertAdjacentHTML(
        "afterbegin",
        "<div class='task'>" + inner + "</div>"
      );
  },
  success: (element) => {
    if (element.parentElement.attributes.done.textContent == "0") {
      element.parentElement.attributes.done.textContent = "1";
      element.parentElement.children[0].style.background = "red";
      element.parentElement.children[0].innerHTML += ` [${
        Date().split(" ")[4]
      } - `;
      // element.parentElement.children[0].innerHTML = element.parentElement.children[0].innerHTML + "123"
    } else if (element.parentElement.attributes.done.textContent == "1") {
      element.parentElement.attributes.done.textContent = "2";
      element.parentElement.children[0].style.background = "green";
      element.parentElement.children[0].innerHTML.replace("<br>", "");
      element.parentElement.children[0].innerHTML += `${Date().split(" ")[4]}]`;
    } else if (element.parentElement.attributes.done.textContent == "2") {
      element.parentElement.attributes.done.textContent = "0";
      element.parentElement.children[0].style.background = "#141414";
    }
  },
  failure: (element) => {
    if (element.parentElement.attributes.done.textContent != "2") {
      element.parentElement.attributes.done.textContent = "2";
      element.parentElement.children[0].style.background = "darkred";
    } else {
      element.parentElement.attributes.done.textContent = "0";
      element.parentElement.children[0].style.background = "#141414";
    }
  },
  remove: (element) => {
    confirmed = confirm("Remove?");
    if (confirmed) {
      element.parentElement.remove();
    }
  },
  dateWider: (element, mode) => {
    if (element.style.height == "") {
      element.style.height = "70px";
    }
    if (mode) {
      element.style.height = element.offsetHeight + (70 + 15) + "px";
    } else {
      element.style.height = element.offsetHeight + (-70 - 15) + "px";
    }
  },
  drop: () => {
    confirmed = confirm("Drop database?");
    if (confirmed) {
      document.querySelector("body").innerHTML = "";
      localStorage.removeItem("save");
      location.reload(1);
    }
  },
};

document.querySelector("html").addEventListener("click", function () {
  planner.save();
});

document.querySelector("html").addEventListener("contextmenu", function () {
  planner.save();
});

document.addEventListener(
  "keyup",
  (event) => {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
    planner.save();
  },
  false
);

let today = planner.getDate();
let highlightInterval = setInterval(planner.highLightNewDay, 1000);

document.addEventListener("DOMContentLoaded", function (event) {
  let loaded = localStorage.getItem("save");
  if (loaded == null) loaded = "";
  if (loaded.length > 0) {
    planner.load();
    planner.scrollIntoView();
    document.querySelector("html").scrollBy(0, -15);
  }
  planner.allowSave = 1;
});
