// alertVisibility.js
let alertVisible = false;  

const setAlertVisibility = (value) => {
  alertVisible = value;
};

const isAlertVisible = () => {
  return alertVisible;
};

export { setAlertVisibility, isAlertVisible };
