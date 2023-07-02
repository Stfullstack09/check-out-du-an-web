const TbodyRender = document.querySelector(".t-body-render-admin");
const FormAddNewProduct = document.querySelector("#form-add-new-product");
const InputData = document.querySelectorAll(".input-add-data");
const ModalBootstrapBTN = document.querySelector("#button-open-modal");
const ModalBootstrapBTNHidden = document.querySelector(
    "#button-open-modal-Hidden"
);
const filterPrice = document.querySelector("#filter-product--js-admin");
const InputSearch = document.querySelector("#input-search-input");

let ProductList = [];
let ProductSearch = [];

// ham format gia tien
function handleFormatVND(price) {
    return price.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
    });
}

function ProductItem(item, index) {
    return `
    <tr>
    <th scope="row">${index + 1}</th>
    <td>${item.name}</td>
    <td>${item.type}</td>
    <td>${handleFormatVND(item.price)}</td>
    <td class="text-center">
        <button class="btn btn-success mb-mobile" onclick="handleClickEdit(${
            item.id
        })">
            <i class="bi bi-ticket-detailed-fill"></i>
        </button>
        <button class="btn btn-warning" onclick="handleDelete(${item.id})">
            <i class="bi bi-trash2-fill"></i>
        </button>
    </td>
</tr>
    `;
}

// ham render
function Render(list) {
    if (!list || list.length === 0) {
        if (TbodyRender) {
            TbodyRender.innerHTML = `<tr>
            <td colspan="5" class="text-center">Không có sản phẩm nào thỏa mãn!</td></tr>`;
        }
        return;
    }

    let Product = list.map((item, index) => ProductItem(item, index)).join("");

    if (TbodyRender) {
        TbodyRender.innerHTML = Product;
    }
}

function Fetch() {
    axios
        .get("https://6219f55a81d4074e85b5d5e2.mockapi.io/son/a/1/product")
        .then((response) => {
            if (response.status === 200) {
                ProductList = [...response.data];
                Render(ProductList);
            }
        })
        .catch((err) => {
            alert("Co loi xay ra!");
            console.log(err);
        });
}

document.addEventListener("DOMContentLoaded", Fetch);

FormAddNewProduct.onsubmit = (e) => {
    e.preventDefault();
    const DataMethod = FormAddNewProduct.getAttribute("data-method") || "post";
    const IdProduct = FormAddNewProduct.getAttribute("data-product");

    const dataBuild = {};

    InputData.forEach((item) => {
        dataBuild[item.name] = item.value;
    });

    // validate du lieu mac du validate mot luot roi luot nay la lop bao ve thu 2
    if (
        !dataBuild.name ||
        !dataBuild.price ||
        !dataBuild.screen ||
        !dataBuild.backCamera ||
        !dataBuild.frontCamera ||
        !dataBuild.img ||
        !dataBuild.desc ||
        !dataBuild.type
    ) {
        alert("Bạn đã nhập thiếu trường!");
        return;
    }

    if (Number(dataBuild.price) === NaN) {
        alert("Giá chỉ chấp nhận số");
        return;
    } else {
        dataBuild.price = Number(dataBuild.price);
    }

    if (DataMethod === "post") {
        axios
            .post(
                "https://6219f55a81d4074e85b5d5e2.mockapi.io/son/a/1/product",
                dataBuild
            )
            .then((response) => {
                if (response.status === 201) {
                    Fetch();
                    ModalBootstrapBTNHidden.click();
                    FormAddNewProduct.reset();
                }
            })
            .catch((err) => {
                alert("Co loi xay ra!");
                console.log(err);
            });
    }

    if (DataMethod === "put" && IdProduct) {
        axios
            .put(
                `https://6219f55a81d4074e85b5d5e2.mockapi.io/son/a/1/product/${IdProduct}`,
                dataBuild
            )
            .then((response) => {
                if (response.status === 200) {
                    Fetch();
                    ModalBootstrapBTNHidden.click();
                    FormAddNewProduct.reset();
                }
            })
            .catch((err) => {
                alert("Co loi xay ra!");
                console.log(err);
            });
    }
};

// edit product
function handleClickEdit(id) {
    // trong truong hop nay co the call api de lay thong tin chi tiet ve sua nhung de toi uu hieu nang tan dung bien "ProductList"

    let Product = ProductList.find((item) => item.id == id);
    FormAddNewProduct.setAttribute("data-product", id);
    FormAddNewProduct.setAttribute("data-method", "put");

    InputData.forEach((item) => {
        for (let i in Product) {
            if (item.name === i) {
                item.value =
                    i === "type" ? Product[i].toLowerCase() : Product[i];
            }
        }
    });

    ModalBootstrapBTNHidden.click();
}

ModalBootstrapBTN.onclick = () => {
    FormAddNewProduct.setAttribute("data-method", "post");
    FormAddNewProduct.reset();
};

// handle delete
function handleDelete(id) {
    let check = confirm("Bạn chắc chắn xóa sản phẩm đó không !");
    if (!check) return;

    axios
        .delete(
            `https://6219f55a81d4074e85b5d5e2.mockapi.io/son/a/1/product/${id}`
        )
        .then((response) => {
            if (response.status === 200) {
                Fetch();
            }
        });
}

// filter gia san pham

function handleFilter(value) {
    switch (value) {
        case "all": {
            if (ProductSearch && ProductSearch.length > 0) {
                Render(ProductSearch);
            } else {
                ProductSearch;
            }

            break;
        }

        case "Giá thấp đến cao": {
            let data =
                ProductSearch.length > 0
                    ? [...ProductSearch]
                    : [...ProductList];
            Render(data.sort((a, b) => a.price - b.price));
            break;
        }

        case "Giá cao đến thấp": {
            let data =
                ProductSearch.length > 0
                    ? [...ProductSearch]
                    : [...ProductList];
            Render(data.sort((a, b) => b.price - a.price));
            break;
        }

        default: {
            Render(ProductList);
        }
    }
}

filterPrice.onchange = (e) => {
    handleFilter(e.target.value);
};

InputSearch.oninput = (e) => {
    // tim kiem san pham theo ten
    const regex = new RegExp(e.target.value, "i");
    const matchProduct = ProductList.filter((item) => regex.test(item.name));
    ProductSearch = [...matchProduct];
    Render(matchProduct);
    handleFilter(filterPrice.value);
};
