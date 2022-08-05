import $ from "jquery";
import "sanitize.css";

// console.log($);

///////////////////STATE///////////////////////
const app = {
  page: "#start",
  instructpage: ["#one", "#two", "#three"],
};

///////////////////HANDLER///////////////////////

///////////////////RENDER///////////////////////
const render = () => {
  $(".page").hide();
  $(app.page).show();
  $(".instruction-page").hide();
  $(app.instructpage[0]).show();
};

///////////////////MAIN///////////////////////
const main = () => {
  $(".btnplay").on("click", () => {
    app.page = "#game";
    render();
  });
  $("#btnforward").on("click", (event) => {
    for (let i = 0; i < app.instructpage.length; i++) {
      if (event.target.id === "btnforward") {
        app.instructpage(i++);
      }
    }
    render();
  });
  render();
};
main();
