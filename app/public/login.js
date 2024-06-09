const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = e.target.children.user.value;
    const password = e.target.children.password.value; 
    
    try {
        const res = await fetch("http://localhost:7000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, password })
        });
        
        if (!res.ok) {
            if (mensajeError) {
                mensajeError.classList.toggle("escondido", false);
            }
            return;
        }
        
        const resJson = await res.json();
        if (resJson.redirect) {
            window.location.href = resJson.redirect;
        }
    } catch (error) {
        console.error("Error al realizar la petición:", error);
        if (mensajeError) {
            mensajeError.classList.toggle("escondido", false);
        }
    }
});
