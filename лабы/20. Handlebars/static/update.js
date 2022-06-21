function update(previousNumber) {
  const form = document.getElementById("update");

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
    
  fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      previousNumber: previousNumber,
      number: number,
      name: name,
    }),
  }).then((result) => {
    if (result.redirected) {
      window.location = result.url;
      return;
    }

    if (!result.ok) {
      alert("Check input data");
      window.location = window.location.href;
    }
  });
}

function deleteNumber(number) {
  fetch(`http://localhost:3000/delete/${number}`, {
    method: "DELETE",
  }).then((result) => {
    if (result.redirected) {
      window.location = result.url;
      }
  });
}
