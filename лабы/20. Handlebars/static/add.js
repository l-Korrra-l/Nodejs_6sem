function add() {
  const form = document.getElementById("Add");

  const number = form.elements.number.value;
  const name = form.elements.name.value;

  if (number.length == 0 || name.length == 0) {
    alert("Data legth must be more than 0");
    return;
  }

  let phoneno =  /^\+?([0-9]{3})\)? ([0-9]{2}) ([0-9]{7})$/;
    if(!number.match(phoneno)) {
      alert("Number should have one of the following formats:  +XXX XX XXXXXXX");
      return false;
    }

  fetch("http://localhost:3000/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.elements.name.value,
      number: form.elements.number.value,
    }),
  }).then((result) => {
    if (!result.ok) {
      alert("Number already exist");
    }

    if (result.redirected) {
      window.location = result.url;
    }
  });
}
