// lay ra cac the
const ProductRender = document.querySelector(".render---product");
const SelectFilter = document.querySelector("#filter-product--js");
const CountCart = document.querySelector(".jsx-count-cart");
const CartWrapper = document.querySelector(".cart-wrapper-icon");
const PageCartWrapper = document.querySelector(".cart-detail");
const OverlayCart = PageCartWrapper.querySelector(".overlay-cart");
const PageRenderCart = PageCartWrapper.querySelector(".cart-wrapper");
const CountDetailPageCart = document.querySelector("#cart-detail-count");
const RenderItemCart = document.querySelector(".jsx-render-pro");
const TotalOrderValue = document.querySelector(".total-gia-tri-don-hang");
const ProvisionalValue = TotalOrderValue.querySelector("#gia-tri-tam-tinh");
const CalculatedValue = TotalOrderValue.querySelector("#gia-tri-da-tinh");
const btnCheckOutDone = document.querySelector("#check-out-done");

CountCart.innerHTML = JSON.parse(localStorage.getItem("CartList"))
    ? JSON.parse(localStorage.getItem("CartList")).length
    : 0;

// config ajax
const settings = {
    url: "https://6219f55a81d4074e85b5d5e2.mockapi.io/son/a/1/product",
    method: "GET",
    timeout: 0,
};

// ham format gia tien
function handleFormatVND(price) {
    return price.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
    });
}

// ham tao ra cac element render
function ProductCard(item) {
    return `<div class="col-12 col-lg-3">
    <div>
      <div
                class="image-section product-trend"
            >
                <div class="image-section-children">
                    <div
                        class="image-product-trend"
                        style="
                            background-image: url('${item.img}');
                        "
                    >
                        <div
                            class="jsx-nav-redirect"
                        >
                            <span
                            onclick="handleAddToCart(${item.id});"
                            class="click-add-to-card"
                                ><i
                                    class="bi bi-search"
                                ></i
                                >Thêm Giỏ Hàng</span
                            >
                            <p>
                            ${item.desc}
                            </p>
                            
                        </div>
                    </div>
                    <p
                        class="introduction-text-product-trend"
                    >
                    <span
                    class="d-block text-start text-intro-trend-category"
                    >Nhãn hiệu <strong>${item.type}</strong></span
                >
                        <span
                            class="d-block text-start text-intro-trend-category"
                            > backCamera : ${item.backCamera}</span
                        >
                        <span
                            class="d-block text-start text-intro-trend-category"
                            >frontCamera: ${item.frontCamera}</span
                        ><span
                            class="text-start text-intro-trend-name"
                            ><strong
                                >${item.name}</strong
                            ></span
                        ><span
                            class="d-block text-start text-intro-trend-price"
                            ><input
                                disabled=""
                                class="jsx-input-add disable"
                                type="text"
                                value="${handleFormatVND(item.price)}"
                            /></span
                        >
                    </p>
                </div>
            </div>
    </div>
</div>`;
}

// item cart
function ItemCart(item) {
    return `
    <div class="col-12 item">
    <div class="row">
        <div
            class="col-4 introduce"
        >
            <div
                class="image"
                style="background-image: url('${item.img}')"
            ></div>
            <div
                class="introduction"
            >
                <p>
                    <strong>
                        ${item.name}
                    </strong>
                </p>
                <span
                    >size:
                    ${item.desc}</span
                >
            </div>
        </div>
        <div
            class="col-2 price-pro d-inline-flex justify-content-center align-items-center customize-jsx-format"
        >
           ${handleFormatVND(item.price)}
        </div>
        <div
            class="col-2 count-pro d-inline-flex justify-content-center align-items-center"
        >
            <button onclick="handleClickCart(${item.id}, ${
        item.count
    }, 'down')">-</button>
            <input
                id="count-cart-wrapper-detail"
                disabled
                type="text"
                value="${item.count}"
            />
            <button onclick="handleClickCart(${item.id}, ${
        item.count
    }, 'up')">+</button>
        </div>
        <div
            class="col-3 total-pro d-inline-flex justify-content-end align-items-center customize-jsx-format"
        >
            ${handleFormatVND(item.count * item.price)}
        </div>
        <div
            class="col-1 total-pro d-inline-flex justify-content-end align-items-center cursor-pointer"
        >
            <span onclick="handleDeleteItemCart(${item.id})">
                <i
                    class="bi bi-backspace-reverse"
                ></i>
            </span>
        </div>
    </div>
</div>
`;
}

// ham render
function Render(list) {
    // khong co list hoac list khong co phan tu nao cung khong lam gi ca;
    if (!list || list.length === 0) return;

    let CardProduct = list.map((item) => ProductCard(item)).join("");

    if (ProductRender) {
        ProductRender.innerHTML = CardProduct;
    }
}

// ham render item cart ( co the tai su dung ham Render ben tren nhung viet moi cho tuong minh )
function RenderItemCartFunC(dataCart) {
    CountDetailPageCart.innerHTML = `${dataCart.length} Sản phẩm trong giỏ hàng`;
    CountCart.innerHTML = dataCart.length;
    if (dataCart && dataCart.length > 0) {
        let CardProduct = dataCart.map((item) => ItemCart(item)).join("");

        if (RenderItemCart) {
            RenderItemCart.innerHTML = CardProduct;
        }
    } else {
        if (RenderItemCart) {
            RenderItemCart.innerHTML = `<p
            class="mt-5 pt-5 text-center fz-13"
        >
            <span
                >Hiện tại trong giỏ hàng của
                bạn không có sản phẩm. ấn
                vào <a href="/">đây</a> để
                tiếp tục mua sắm ❤️</span
            >
        </p>`;
        }
    }
}

// handle total order value
function HandleTotalValueFunc(DataCart) {
    if (DataCart && DataCart.length > 0) {
        let Total = DataCart.reduce((init, item) => {
            return (init += item.count * item.price);
        }, 0);

        ProvisionalValue.setAttribute("value", handleFormatVND(Total));
        CalculatedValue.setAttribute("value", handleFormatVND(Total));
    } else {
        ProvisionalValue.setAttribute("value", handleFormatVND(0));
        CalculatedValue.setAttribute("value", handleFormatVND(0));
    }
}

// defined cac bien luu tru du lieu
const ProductList = [];

// ajax call api
$.ajax(settings).done(function (response) {
    if (response && response.length > 0) {
        ProductList.push(...response);
        Render(response);

        let dataCart = JSON.parse(localStorage.getItem("CartList")) || [];
        HandleTotalValueFunc(dataCart);
    }
});

// filter span pham (luu y check neu co the SelectFilter moi lam nhe)
if (SelectFilter) {
    SelectFilter.onchange = (e) => {
        switch (e.target.value) {
            case "Iphone": {
                if (ProductList && ProductList.length > 0) {
                    let data = ProductList.filter(
                        (item) => item.type.toLowerCase() === "iphone"
                    );

                    Render(data);
                }
                break;
            }

            case "Samsung": {
                if (ProductList && ProductList.length > 0) {
                    let data = ProductList.filter(
                        (item) => item.type.toLowerCase() === "samsung"
                    );

                    Render(data);
                }
                break;
            }

            default: {
                Render(ProductList);
            }
        }
    };
}

// handle add to cart
function handleAddToCart(id) {
    let dataCart = JSON.parse(localStorage.getItem("CartList")) || [];
    let dataProduct = ProductList.find((item) => item.id == id);
    dataProduct.count = 1;

    if (dataCart.length > 0) {
        let dataCheck = dataCart.find((item) => item.id == id);

        if (dataCheck) {
            dataCheck.count += 1;
        } else {
            dataCart.push(dataProduct);
        }

        localStorage.setItem("CartList", JSON.stringify(dataCart));
    } else {
        dataCart.push(dataProduct);
        localStorage.setItem("CartList", JSON.stringify(dataCart));
    }

    CountCart.innerHTML = dataCart.length;
}

// show page cart
CartWrapper.onclick = () => {
    let dataCart = JSON.parse(localStorage.getItem("CartList")) || [];
    RenderItemCartFunC(dataCart);
    HandleTotalValueFunc(dataCart);
    PageRenderCart.classList.toggle("active");
    PageCartWrapper.style.transform = "translateX(0%)";
    OverlayCart.style.display = "block";
};

OverlayCart.onclick = () => {
    PageRenderCart.classList.toggle("active");
    PageCartWrapper.style.transform = "translateX(100%)";
    OverlayCart.style.display = "none";
};

// handle click them hoac giam so luong san pham
function handleClickCart(id, count, type) {
    let dataCart = JSON.parse(localStorage.getItem("CartList"));

    if (dataCart && dataCart.length > 0) {
        const ItemCart = dataCart.find((item) => item.id == id);

        if (ItemCart) {
            if (type === "up") {
                ItemCart.count = count + 1;
                RenderItemCartFunC(dataCart);
                HandleTotalValueFunc(dataCart);
            }

            if (type === "down" && count > 0) {
                ItemCart.count = count - 1;
                RenderItemCartFunC(dataCart);
                HandleTotalValueFunc(dataCart);
            } else if (type === "down" && count == 0) {
                alert("Sản phẩm không thể là số âm !");
            }
        }

        localStorage.setItem("CartList", JSON.stringify(dataCart));
    }
}

// handle click delete item cart
function handleDeleteItemCart(id) {
    let check = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (!check) return;

    let dataCart = JSON.parse(localStorage.getItem("CartList"));

    if (dataCart && dataCart.length > 0) {
        let indexItem = dataCart.findIndex((item) => item.id == id);

        if (indexItem) {
            dataCart.splice(indexItem, 1);
            RenderItemCartFunC(dataCart);
            HandleTotalValueFunc(dataCart);
            localStorage.setItem("CartList", JSON.stringify(dataCart));
        }
    }
}

// handle check out done
btnCheckOutDone.onclick = () => {
    let dataCart = [];

    RenderItemCartFunC(dataCart);
    HandleTotalValueFunc(dataCart);
    localStorage.setItem("CartList", JSON.stringify(dataCart));
    alert("Chúc mừng bạn thanh toán thành công!");
};
