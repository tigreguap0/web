// Efecto de “maquina de escribir” para el título
const title = document.querySelector('.title');
const text = "Serpiente";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        title.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    }
}

title.innerHTML = "";
typeWriter();
