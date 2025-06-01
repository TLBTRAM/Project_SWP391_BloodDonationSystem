const inputs = document.querySelectorAll('.code-inputs input');

inputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    // Chỉ cho nhập số
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;

    if (value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});
