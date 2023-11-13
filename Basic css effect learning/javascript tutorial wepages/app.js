// Movement Animation to happen 
const card = document.querySelector(".card");
const container = document.querySelector(".container");

// Moving Animation Event 
container.addEventListener('mousemove',(e)=>{
    let xAxis = (window.innerWidth / 2 - e.pageX);
    let YAxis = (window.innerWidth / 2 - e.pageY);
    card.style.transform = 
});