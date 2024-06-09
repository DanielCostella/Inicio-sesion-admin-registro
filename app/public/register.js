const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("e.target:", e.target);
    console.log("e.target.children:", e.target.children);
    console.log("e.target.children.user:", e.target.children.user);

    console.log(e.target.children.user.value);

    const res = await fetch("http://localhost:7000/api/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            user: e.target.children.user.value,
            email: e.target.children.email.value,
            password: e.target.children.password.value
        })
    });

    // Verifica si la respuesta no es ok
    if (!res.ok) {
        mensajeError.classList.remove("escondido");
        return;
    }

    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});