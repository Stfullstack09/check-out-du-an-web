const InputEmail = document.querySelector("#login-email");
const InputPassword = document.querySelector("#login-password");
const ButtonLogin = document.querySelector(".button-submit-jsx");

const DataFake = [
    {
        email: "userTest@gmail.com",
        password: 12345678,
    },
    {
        email: "khachhang@gmail.com",
        password: 123456,
    },
    {
        email: "son@gmail.com",
        password: 123456789,
    },
];

ButtonLogin.onclick = () => {
    console.log("sd");

    if (!InputEmail.value || !InputPassword.value) {
        alert("Bạn vui lòng nhập đầy đủ các trường !");
        return;
    }

    let email = InputEmail.value;
    let password = InputPassword.value;

    let user = DataFake.find((item) => {
        if (item.email == email) {
            return item;
        }
    });

    if (user) {
        if (user.password == password) {
            alert("Đăng nhập thành công !");
            localStorage.setItem("isLogin", JSON.stringify("isLogin"));
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/admin/views/admin.html";
        } else {
            alert("Wrong password !");
        }
    } else {
        alert("Email bạn không tồn tại trong hệ thống");
    }
};
