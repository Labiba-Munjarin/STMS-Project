// ========================================
// STMS - FRONTEND API
// ========================================

const API = "http://127.0.0.1:5000/api";


// ========================================
// REGISTER
// ========================================

const registerForm = document.querySelector("#registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const btn = registerForm.querySelector(
            "button[type='submit']"
        );

        if (btn) {
            btn.disabled = true;
            btn.textContent = "⏳ অ্যাকাউন্ট তৈরি হচ্ছে...";
        }

        const name =
            document.querySelector("#name")?.value.trim();

        const email =
            document.querySelector("#register-email")?.value.trim();

        const phone =
            document.querySelector("#phone")?.value.trim();

        const password =
            document.querySelector("#register-password")?.value;

        const role =
            document.querySelector("#role")?.value;


        // Basic validation

        if (!name || !email || !phone || !password || !role) {

            alert("⚠️ সব তথ্য পূরণ করুন।");

            if (btn) {
                btn.disabled = false;
                btn.textContent = "অ্যাকাউন্ট তৈরি করুন";
            }

            return;
        }


        const payload = {
            name,
            email,
            phone,
            password,
            role
        };


        try {

            console.log(
                "Registration request:",
                payload
            );


            const response = await fetch(
                API + "/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );


            const data =
                await response.json().catch(() => ({}));


            console.log(
                "Registration response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "নিবন্ধন করা যায়নি।"
                );
            }


            alert(
                "✅ নিবন্ধন সফল হয়েছে!\n\nএখন আপনার অ্যাকাউন্ট দিয়ে লগইন করুন।"
            );


            registerForm.reset();

            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            let message =
                "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।";


            if (
                error.message &&
                error.message !== "Failed to fetch"
            ) {
                message = error.message;
            }


            alert(
                "❌ " + message +
                "\n\nBackend চালু আছে কিনা নিশ্চিত করুন।"
            );


            if (btn) {
                btn.disabled = false;
                btn.textContent =
                    "অ্যাকাউন্ট তৈরি করুন";
            }

        }

    });

}



// ========================================
// LOGIN
// ========================================

const loginForm =
    document.querySelector("#loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        const btn =
            loginForm.querySelector(
                "button[type='submit']"
            );


        if (btn) {
            btn.disabled = true;
            btn.textContent =
                "⏳ লগইন হচ্ছে...";
        }


        const email =
            document.querySelector(
                "#login-email"
            )?.value.trim();


        const password =
            document.querySelector(
                "#login-password"
            )?.value;


        if (!email || !password) {

            alert(
                "⚠️ ইমেইল ও পাসওয়ার্ড দিন।"
            );


            if (btn) {
                btn.disabled = false;
                btn.textContent = "লগইন";
            }

            return;
        }


        try {

            const response =
                await fetch(
                    API + "/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
                );
            }


            // Save user

            localStorage.setItem(
                "stmsUser",
                JSON.stringify(data.user)
            );


            if (data.token) {

                localStorage.setItem(
                    "stmsToken",
                    data.token
                );

            }


            alert(
                "✅ লগইন সফল হয়েছে!"
            );


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            let message =
                "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।";


            if (
                error.message &&
                error.message !== "Failed to fetch"
            ) {
                message = error.message;
            }


            alert(
                "❌ " + message
            );


            if (btn) {
                btn.disabled = false;
                btn.textContent =
                    "লগইন";
            }

        }

    });

}