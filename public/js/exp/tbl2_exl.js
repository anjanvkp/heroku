$("#btnEXL").click(function () {
  $("#jqGrid").table2excel({
    filename: "EXPENSES_TRACKER.xls"
  });
});
