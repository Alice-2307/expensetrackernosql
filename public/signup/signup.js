const form = document.getElementById("expense");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userData = {
        name: name.value,
        email: email.value,
        password: password.value
    };
    try {
        let data = await axios.post("http://localhost:3000/signup", userData);
        window.location.href = "../login/login.html";
    } catch (err) {
        if (err.response !== undefined) {
            error.textContent = `Error: ${err.response.data.Error}`
        }
        else {
            error.textContent = `Error: ${err.message}`
        }
    }
});