function updateP(){
    const pspan = document.getElementById('curentyear');
    if (pspan){
        pspan.textContent = new Date().getFullYear();
    }
}

document.getElementById('curentyear').textContent = new Date().getFullYear();