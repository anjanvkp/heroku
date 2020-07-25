$("#sr").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#jqGrid tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});