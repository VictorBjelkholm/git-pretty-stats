$ ->
  window.chartColors = [ "#3498DB", "#2ECC71", "#9B59B6", "#E74C3C", "#1ABC9C", "#F39C12", "#95A5A6" ]
  oldSpan = 4
  $("#tabs a").on "click", (e) ->
    e.preventDefault()
    $(this).tab "show"

  $("#spans").on "change", (e) ->
    newSpan = $(e.target).val()
    $(".span" + oldSpan).addClass "span" + newSpan
    $(".span" + oldSpan).removeClass "span" + oldSpan
    oldSpan = newSpan
    $elements = $("#contributors div[data-highcharts-chart]")
    newWidth = $(".thumbnail:first").width()
    numElements = $elements.length - 1
    console.time "Resizing all graphs"
    doLoop 0, newWidth, numElements

  loadContent()

updateChartsWidth = (number, width) ->
  $("#chart-" + number).highcharts().setSize width, 200, false

doLoop = (i, width, numElements) ->
  updateChartsWidth i, width
  if i < numElements
    setTimeout (->
      doLoop i + 1, width, numElements
    ), 0
  else
    console.timeEnd "Resizing all graphs"

loadContent = ->
  $("#loader").modal show: true
  $.ajax
    url: "/stats"
    success: (data) ->
      if typeof data.commits_by_date is "undefined" and data.commits_by_date is null
        $("#loader h3").html "Shit..."
        $("#loader p").html "Something went wrong"
        return false
      $("#loader").modal "hide"
      renderCommitsByDateChart data.commits_by_date
      renderCommitsByHourChart data.commits_by_hour
      renderCommitsByDayChart data.commits_by_day
      $("a[href='#contributors']").trigger "click"
      renderCommitsByContributorsChart data.commits_by_contributor
      $("a[href='#commits']").trigger "click"