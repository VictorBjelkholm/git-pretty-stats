var doLoop, loadContent, updateChartsWidth;

$(function() {
  var oldSpan;
  window.chartColors = ["#3498DB", "#2ECC71", "#9B59B6", "#E74C3C", "#1ABC9C", "#F39C12", "#95A5A6"];
  oldSpan = 4;
  $("#tabs a").on("click", function(e) {
    e.preventDefault();
    return $(this).tab("show");
  });
  $("#spans").on("change", function(e) {
    var $elements, newSpan, newWidth, numElements;
    newSpan = $(e.target).val();
    $(".span" + oldSpan).addClass("span" + newSpan);
    $(".span" + oldSpan).removeClass("span" + oldSpan);
    oldSpan = newSpan;
    $elements = $("#contributors div[data-highcharts-chart]");
    newWidth = $(".thumbnail:first").width();
    numElements = $elements.length - 1;
    console.time("Resizing all graphs");
    return doLoop(0, newWidth, numElements);
  });
  return loadContent();
});

updateChartsWidth = function(number, width) {
  return $("#chart-" + number).highcharts().setSize(width, 200, false);
};

doLoop = function(i, width, numElements) {
  updateChartsWidth(i, width);
  if (i < numElements) {
    return setTimeout((function() {
      return doLoop(i + 1, width, numElements);
    }), 0);
  } else {
    return console.timeEnd("Resizing all graphs");
  }
};

loadContent = function() {
  $("#loader").modal({
    show: true
  });
  return $.ajax({
    url: "/stats",
    success: function(data) {
      if (typeof data.commits_by_date === "undefined" && data.commits_by_date === null) {
        $("#loader h3").html("Shit...");
        $("#loader p").html("Something went wrong");
        return false;
      }
      $("#loader").modal("hide");
      renderCommitsByDateChart(data.commits_by_date);
      renderCommitsByHourChart(data.commits_by_hour);
      renderCommitsByDayChart(data.commits_by_day);
      $("a[href='#contributors']").trigger("click");
      renderCommitsByContributorsChart(data.commits_by_contributor);
      return $("a[href='#commits']").trigger("click");
    }
  });
};
