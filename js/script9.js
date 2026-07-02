document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("billingToggle");
  if (!toggle) {
    return;
  }

  var monthlyTab = document.getElementById("monthly-tab");
  var yearlyTab = document.getElementById("yearly-tab");

  toggle.addEventListener("change", function () {
    if (toggle.checked && yearlyTab) {
      yearlyTab.click();
    } else if (monthlyTab) {
      monthlyTab.click();
    }
  });
});
