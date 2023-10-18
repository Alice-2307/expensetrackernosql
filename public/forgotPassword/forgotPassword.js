const form = document.getElementById("expense");

const email = document.getElementById("email");

const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const emailData = {
        email: email.value,
    }
    try {
        let result = await axios.post("http://localhost:3000/forgotpassword", emailData)
        window.location.href = "../login/login.html";

    } catch (err) {
        if (err.response !== undefined) {
            error.textContent = `Error: ${err.response.data.Error}`;
        } else {
            error.textContent = `Error: ${err.message}`;
        }
    }
})