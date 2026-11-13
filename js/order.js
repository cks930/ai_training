function makeShop(id, category, name, address, phone, source, menu, priceType) {
    return {
        id,
        category,
        name,
        address,
        phone,
        source,
        priceType: priceType || "公用店家參考價，請向店家確認。",
        menu: menu.map(function (item) {
            return { name: item[0], price: item[1] };
        })
    };
}

function dinbendon(id) {
    return "https://dinbendon.net/do/idine?shop=" + id;
}

// 沿用西屯區參考資料，並非即時同步
const shops = [
    makeShop(
        "b06", "便當", "五福園",
        "台中市西屯區大容西街25-1號", "04-2310-6909",
        dinbendon(537582),
        [
            ["炸排骨便當", 115],
            ["滷排骨便當", 115],
            ["三杯雞便當", 105],
            ["酥炸大雞腿便當", 125]
        ]
    ),
    makeShop(
        "b08", "便當", "金大元便當－河南店",
        "台中市西屯區河南路二段463號", "04-2700-6688",
        dinbendon(424099),
        [
            ["紅燒牛肉飯", 150],
            ["招牌雞腿飯", 140],
            ["排骨飯", 130],
            ["紅燒小排飯", 120]
        ]
    ),
    makeShop(
        "b09", "便當", "超吉大盛－青海店",
        "台中市西屯區青海路一段133號", "04-2312-7566",
        dinbendon(268455),
        [["厚燒排骨丼飯", 120]]
    ),
    makeShop(
        "d01", "飲料", "可不可熟成紅茶－台中朝富店",
        "台中市西屯區朝富路6號", "",
        "https://www.ubereats.com/tw/store/可不可熟成紅茶-台中朝富店/cL06QrwXV6-3-Tgslw3C9g",
        [
            ["熟成歐蕾（容量待確認）", 65],
            ["白玉歐蕾（容量待確認）", 70],
            ["熟成奶茶（容量待確認）", 55]
        ],
        "Uber Eats參考列價，容量與加料請另確認。"
    ),
    makeShop(
        "d09", "飲料", "鶴茶樓－逢甲",
        "台中市西屯區福星路542-5號", "04-2452-4263",
        dinbendon(598910),
        [
            ["鶴頂紅茶 M", 30],
            ["鶴頂紅茶 L", 35],
            ["鶴頂那堤 M", 50],
            ["鶴頂那堤 L", 60]
        ]
    ),
    makeShop(
        "d10", "飲料", "MATEAS鮮奶茶沙龍－永福路",
        "台中市西屯區永福路86號", "04-2463-3158",
        dinbendon(473034),
        [
            ["經典康緹紅茶 M", 30],
            ["經典康緹紅茶 L", 35],
            ["康緹鮮奶茶 M", 58],
            ["康緹鮮奶茶 L", 68]
        ]
    )
];

const groups = {
    food: {
        title: "餐飲訂單",
        receiver: "餐飲承辦單位",
        categories: ["便當", "飲料"]
    },
    goods: {
        title: "公司日用品訂單",
        receiver: "日用品承辦單位",
        categories: ["口罩", "隱形眼鏡"]
    }
};

let carts = { food: [], goods: [] };

// 保留老師的 flag 驗證方式
let flag_employee = false;
let flag_department = false;
let flag_shop = false;
let flag_pname = false;
let flag_price = false;
let flag_category = false;
let flag_remark = false;

let dataJSON = null;
let confirmGroup = null;
let sending = false;

$(function () {
    function area() {
        return $("input[name='area']:checked").val();
    }

    function category() {
        return $("#category").val();
    }

    function isFood() {
        return area() === "food";
    }

    function currentShop() {
        return shops.find(function (shop) {
            return isFood() &&
                shop.id === $("#shop").val() &&
                shop.category === category();
        });
    }

    function currentItem() {
        let shop = currentShop();
        let index = $("#pname").val();
        if (!shop || index === "") return null;
        return shop.menu[Number(index)] || null;
    }

    function unit() {
        return {
            "便當": "份",
            "飲料": "杯",
            "口罩": "盒／包",
            "隱形眼鏡": "盒"
        }[category()] || (isFood() ? "份" : "盒");
    }

    function money(value) {
        return value.toLocaleString("zh-TW");
    }

    function total(group) {
        return carts[group].reduce(function (sum, item) {
            return sum + item.price * item.num;
        }, 0);
    }

    function setValid(selector, valid) {
        $(selector)
            .toggleClass("is-valid", valid)
            .toggleClass("is-invalid", !valid)
            .attr("aria-invalid", String(!valid));
    }

    function clearValidation(selector) {
        $(selector)
            .removeClass("is-valid is-invalid")
            .removeAttr("aria-invalid");
    }

    function checkText(selector, min, max) {
        let length = Array.from($(selector).val().trim()).length;
        let valid = length >= min && length <= max;
        setValid(selector, valid);
        return valid;
    }

    function validPrice() {
        let value = $("#price").val();
        let price = Number(value);
        return value !== "" && Number.isInteger(price) &&
            price >= 1 && price <= 10000;
    }

    function validNum() {
        let num = Number($("#num").val());
        return Number.isInteger(num) && num >= 1 && num <= 100;
    }

    function updateItemTotal() {
        $("#item-total").text(
            validPrice() && validNum()
                ? money(Number($("#price").val()) * Number($("#num").val()))
                : "—"
        );
    }

    function closeConfirm() {
        $("#showmsg").addClass("d-none");
        dataJSON = null;
        confirmGroup = null;
    }

    function changeArea() {
        let food = isFood();

        $("body").toggleClass("goods-mode", !food);
        $("#food-fields").toggleClass("d-none", !food);
        $("#goods-fields").toggleClass("d-none", food);
        $("#editor-title").text(food ? "選擇餐飲" : "選擇公司商品");
        $("#add-btn").text(food ? "加入餐飲清單" : "加入日用品清單");

        $("#price-note").text(
            food
                ? "單價為參考列價；容量、加料及實際售價不同時，請調整後再加入。"
                : "公司商品型號與價格依內部公告填寫，不需供應商資料。"
        );

        $("#category").empty()
            .append(new Option("請選擇分類", ""));

        groups[area()].categories.forEach(function (value) {
            $("#category").append(new Option(value, value));
        });

        clearValidation("#category");
        $("#add-status").text("");
        changeCategory();
        renderCart();
    }

    function changeCategory() {
        $("#goods-name, #price, #remark").val("");
        $("#num").val(1);
        $("#sugar, #ice").prop("selectedIndex", 0);
        $("#unit-text").text(unit());
        $("#num-error").addClass("d-none");

        $("#drink-fields").toggleClass("d-none", category() !== "飲料");
        $("#remark-optional").toggleClass("d-none", !isFood());
        $("#remark-label").text(isFood() ? "訂購備註" : "商品規格");

        const placeholders = {
            "便當": "例如：飯少、不加辣",
            "飲料": "容量待確認或有其他需求時，請在此註明",
            "口罩": "型號、尺寸、顏色、每盒或每包片數",
            "隱形眼鏡": "型號、既有驗配度數、顏色、每盒片數"
        };

        $("#remark").attr(
            "placeholder",
            placeholders[category()] || "請先選擇分類"
        );

        $("#remark-help").text(
            isFood()
                ? "選填，最多150字；不同口味與規格請分別加入。"
                : "必填2–150字；不同規格分別加入，口罩請註明以盒或包計價。"
        );

        $("#remark-error").text(
            isFood() ? "備註最多150字。" : "商品規格需為2–150字。"
        );

        flag_shop = !isFood();
        flag_pname = false;
        flag_price = false;
        flag_category = false;
        flag_remark = false;

        clearValidation("#goods-name, #price, #remark, #num");
        loadShops();
    }

    function loadShops() {
        $("#shop").empty()
            .append(new Option("請選擇西屯區店家", ""))
            .prop("disabled", !isFood() || !category());

        shops.filter(function (shop) {
            return isFood() && shop.category === category();
        }).forEach(function (shop) {
            $("#shop").append(new Option(shop.name, shop.id));
        });

        $("#pname").empty()
            .append(new Option("請先選擇店家", ""))
            .prop("disabled", true);

        $("#shop-info").addClass("d-none");
        $("#price").val("");

        flag_shop = !isFood();
        flag_pname = false;
        flag_price = false;

        clearValidation("#shop, #pname, #price");
        closeConfirm();
        updateItemTotal();
    }

    $("#employee").on("change", function () {
        flag_employee = checkText("#employee", 2, 20);
    });

    $("#department").on("change", function () {
        flag_department = checkText("#department", 2, 30);
    });

    $("input[name='area']").on("change", changeArea);

    $("#category").on("change", function () {
        changeCategory();
        flag_category = groups[area()].categories.includes(category());
        setValid("#category", flag_category);
    });

    $("#shop").on("change", function () {
        let shop = currentShop();

        flag_shop = !!shop;
        setValid("#shop", flag_shop);

        $("#pname").empty()
            .append(new Option("請選擇餐點／規格", ""))
            .prop("disabled", !shop);

        $("#price").val("");
        flag_pname = false;
        flag_price = false;
        clearValidation("#pname, #price");

        $("#shop-info").toggleClass("d-none", !shop);

        if (shop) {
            $("#shop-name").text(shop.name);
            $("#shop-address").text(shop.address);
            $("#shop-phone").text(
                shop.phone ? "電話：" + shop.phone : "電話：尚未核實"
            );
            $("#shop-price-type").text(shop.priceType);
            $("#source-link").attr("href", shop.source);

            $("#map-link").attr(
                "href",
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(shop.name + " " + shop.address)
            );

            shop.menu.forEach(function (item, index) {
                $("#pname").append(new Option(
                    item.name + "｜參考 NT$" + item.price, index
                ));
            });
        }

        updateItemTotal();
    });

    $("#pname").on("change", function () {
        let item = currentItem();

        flag_pname = !!item;
        setValid("#pname", flag_pname);
        $("#price").val(item ? item.price : "");
        flag_price = validPrice();

        clearValidation("#price");
        updateItemTotal();
    });

    $("#goods-name").on("change", function () {
        flag_pname = checkText("#goods-name", 2, 80);
    });

    $("#price").on("change", function () {
        flag_price = validPrice();
        setValid("#price", flag_price);
    });

    $("#price").on("input change", updateItemTotal);

    $("#num").on("input change", function () {
        $("#num-error").toggleClass("d-none", validNum());
        updateItemTotal();
    });

    $("#num-minus, #num-plus").on("click", function () {
        let num = Number($("#num").val());
        if (!Number.isInteger(num)) num = 1;

        num += this.id === "num-plus" ? 1 : -1;

        $("#num").val(Math.max(1, Math.min(100, num)))
            .trigger("change");
    });

    $("#remark").on("change", function () {
        flag_remark = checkText("#remark", isFood() ? 0 : 2, 150);
    });

    $("#order-form :input").on("input change", function () {
        if (!sending) closeConfirm();
    });

    function itemKey(item) {
        return JSON.stringify([
            item.shop || "",
            item.category,
            item.name,
            item.price,
            item.unit,
            item.sugar || "",
            item.ice || "",
            item.remark
        ]);
    }

    function description(item) {
        let parts = [];

        if (item.category === "飲料") {
            parts.push("甜度需求：" + item.sugar);
            parts.push("冰量需求：" + item.ice);
        }

        if (item.remark) parts.push(item.remark);
        return parts.join("；") || "無特殊需求";
    }

    function renderCart() {
        let group = area();
        let other = group === "food" ? "goods" : "food";
        let list = $("#cart-list").empty();

        $("#cart-title").text(
            groups[group].title.replace("訂單", "訂購清單")
        );
        $("#receiver-text").text("接收單位：" + groups[group].receiver);
        $("#total-label").text(group === "food" ? "餐飲金額" : "日用品金額");
        $("#ok-btn").text("確認" + groups[group].title);

        $("#food-count").text(carts.food.length + " 項");
        $("#goods-count").text(carts.goods.length + " 項");
        $("#current-count").text(carts[group].length + " 項");
        $("#total-text").text(money(total(group)));

        $("#other-cart-note").text(
            carts[other].length
                ? "另一專區保留 " + carts[other].length +
                    " 項商品，需切換後另外送出。"
                : "本清單獨立送出，由對應單位處理。"
        );

        if (carts[group].length === 0) {
            $("<div>").addClass("empty-cart")
                .text("尚未加入商品，請先選擇商品與數量。")
                .appendTo(list);
        }

        carts[group].forEach(function (item, index) {
            let box = $("<div>").addClass("cart-item");

            $("<div>").addClass("cart-meta")
                .text(item.category + "｜" + (item.shop || "公司自行製造"))
                .appendTo(box);

            $("<div>").addClass("cart-name")
                .text(item.name).appendTo(box);

            $("<div>").addClass("cart-remark")
                .text(description(item)).appendTo(box);

            let controls = $("<div>").addClass("cart-controls");
            let quantity = $("<div>").addClass("cart-quantity");

            [-1, 1].forEach(function (step) {
                if (step === 1) {
                    $("<span>").text(item.num).appendTo(quantity);
                }

                $("<button>").attr({
                    type: "button",
                    "data-index": index,
                    "data-step": step,
                    "aria-label": (step === 1 ? "增加" : "減少") +
                        item.name + "數量"
                }).addClass("btn btn-outline-secondary cart-step")
                    .prop(
                        "disabled",
                        sending ||
                        (step === -1 && item.num <= 1) ||
                        (step === 1 && item.num >= 100)
                    )
                    .text(step === 1 ? "＋" : "－")
                    .appendTo(quantity);
            });

            controls.append(quantity);

            $("<strong>").addClass("small")
                .text("NT$" + money(item.price * item.num))
                .appendTo(controls);

            $("<button>").attr({
                type: "button",
                "data-index": index,
                "aria-label": "移除" + item.name
            }).addClass("btn btn-outline-danger remove-btn")
                .prop("disabled", sending)
                .text("移除").appendTo(controls);

            box.append(controls);

            $("<div>").addClass("form-text")
                .text("單價 NT$" + money(item.price) + "／" + item.unit)
                .appendTo(box);

            list.append(box);
        });

        $("#ok-btn, #btnCancel")
            .prop("disabled", sending || carts[group].length === 0);
    }

    $("#order-form").on("submit", function (event) {
        event.preventDefault();
        if (sending) return;

        $("#price, #remark").trigger("change");

        flag_category = groups[area()].categories.includes(category());
        setValid("#category", flag_category);
        $("#num-error").toggleClass("d-none", validNum());

        if (isFood()) {
            flag_shop = !!currentShop();
            flag_pname = !!currentItem();

            setValid("#shop", flag_shop);
            setValid("#pname", flag_pname);
        } else {
            flag_shop = true;
            $("#goods-name").trigger("change");
        }

        if (!(flag_category && flag_shop && flag_pname &&
            flag_price && flag_remark && validNum())) {
            Swal.fire({
                title: "商品資料未完成",
                text: "請檢查分類、商品、單價、數量與規格。",
                icon: "error",
                confirmButtonText: "返回修正",
                confirmButtonColor: "#456580"
            });
            return;
        }

        let group = area();
        let shop = currentShop();
        let item = currentItem();

        let orderItem = {
            name: isFood() ? item.name : $("#goods-name").val().trim(),
            category: category(),
            price: Number($("#price").val()),
            num: Number($("#num").val()),
            remark: $("#remark").val().trim(),
            unit: unit()
        };

        if (isFood()) {
            orderItem.shop = shop.name;
            orderItem.source = shop.source;
            orderItem.district = "西屯區";
        } else {
            orderItem.manufacture = "公司自行製造";
        }

        if (category() === "飲料") {
            orderItem.sugar = $("#sugar").val();
            orderItem.ice = $("#ice").val();
        }

        let existing = carts[group].find(function (saved) {
            return itemKey(saved) === itemKey(orderItem);
        });

        if (existing) {
            if (existing.num + orderItem.num > 100) {
                Swal.fire({
                    title: "數量超過上限",
                    text: "同一商品與規格合計最多100個訂購單位。",
                    icon: "warning",
                    confirmButtonText: "確定"
                });
                return;
            }

            existing.num += orderItem.num;
        } else {
            carts[group].push(orderItem);
        }

        closeConfirm();
        renderCart();

        $("#add-status").text(
            existing
                ? "相同商品與規格已合併數量。"
                : "已加入「" + orderItem.name + "」。"
        );

        $("#num").val(1);
        $("#remark").val("");
        clearValidation("#remark");
        flag_remark = false;
        updateItemTotal();
    });

    $("#cart-list").on("click", ".cart-step", function () {
        if (sending) return;

        let index = Number($(this).attr("data-index"));
        let step = Number($(this).attr("data-step"));
        let item = carts[area()][index];

        item.num = Math.max(1, Math.min(100, item.num + step));

        closeConfirm();
        renderCart();
    });

    $("#cart-list").on("click", ".remove-btn", function () {
        if (sending) return;

        carts[area()].splice(Number($(this).attr("data-index")), 1);

        closeConfirm();
        renderCart();
        $("#add-status").text("已移除商品。");
    });

    $("#btnCancel").on("click", function () {
        if (sending || !carts[area()].length) return;

        const group = area();

        Swal.fire({
            title: "清空" + groups[group].title + "？",
            text: "另一專區的清單會保留。",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "清空",
            cancelButtonText: "保留",
            confirmButtonColor: "#456580"
        }).then(function (result) {
            if (result.isConfirmed) {
                carts[group] = [];
                closeConfirm();
                renderCart();
                $("#add-status").text("已清空" + groups[group].title + "。");
            }
        });
    });

    $("#ok-btn").on("click", function () {
        if (sending || !carts[area()].length) return;

        $("#employee, #department").trigger("change");

        if (!(flag_employee && flag_department)) {
            Swal.fire({
                title: "訂購人資料未完成",
                text: "請填寫姓名與所屬部門。",
                icon: "error",
                confirmButtonText: "返回修正",
                confirmButtonColor: "#456580"
            }).then(function () {
                $("#order-form .is-invalid").first().trigger("focus");
            });
            return;
        }

        let group = area();
        let items = carts[group].map(function (item) {
            return { ...item };
        });

        let single = items.length === 1;

        // 保留老師原本五個主要欄位
        dataJSON = {
            name: single ? items[0].name : groups[group].title,
            category: [...new Set(items.map(function (item) {
                return item.category;
            }))].join("／"),
            price: single ? items[0].price : total(group),
            num: single ? items[0].num : 1,
            remark: single
                ? description(items[0])
                : "共" + items.length + "項，詳見items",
            employee: $("#employee").val().trim(),
            department: $("#department").val().trim(),
            orderType: group,
            receiver: groups[group].receiver,
            total: total(group),
            items: items
        };

        confirmGroup = group;

        $("#confirm-title").text(groups[group].title + "確認");
        $("#confirm-receiver").text(dataJSON.receiver);
        $("#confirm-employee").text(dataJSON.employee);
        $("#confirm-department").text(dataJSON.department);
        $("#confirm-items").empty();

        items.forEach(function (item) {
            let row = $("<tr>");
            let cell = $("<td>").addClass("item-cell");

            $("<div>").addClass("fw-bold")
                .text(item.name).appendTo(cell);
            $("<div>").addClass("small text-secondary")
                .text(item.shop || "公司自行製造").appendTo(cell);
            $("<div>").addClass("small text-secondary")
                .text(description(item)).appendTo(cell);

            row.append(cell);

            $("<td>").text("NT$" + money(item.price)).appendTo(row);
            $("<td>").text(item.num + " " + item.unit).appendTo(row);
            $("<td>").text("NT$" + money(item.price * item.num))
                .appendTo(row);

            $("#confirm-items").append(row);
        });

        $("#confirm-total").text(money(dataJSON.total));
        $("#showmsg").removeClass("d-none");
        $("#confirm-title").trigger("focus");
    });

    $("#confirm-cancel").on("click", function () {
        if (!sending) closeConfirm();
    });

    function setSending(value) {
        sending = value;

        $("#order-form :input, input[name='area'], #btnCancel, #ok-btn, #showmsg button")
            .prop("disabled", value);

        if (!value) {
            $("#shop").prop("disabled", !isFood() || !category());
            $("#pname").prop("disabled", !currentShop());
        }

        $("#send-btn").text(value ? "傳送中…" : "確認送出");
        renderCart();
    }

    // 保留老師的委派事件與 AJAX 流程
    $("#showmsg").on("click", "#send-btn", function () {
        if (sending || !dataJSON || !confirmGroup) return;

        const submittedGroup = confirmGroup;

        setSending(true);

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/product",
            dataType: "json",
            data: JSON.stringify(dataJSON),
            contentType: "application/json",

            success: function (data) {
                console.log(data);

                // 只清空本次成功送出的專區
                carts[submittedGroup] = [];
                closeConfirm();
                changeArea();

                flag_shop = !isFood();
                flag_pname = false;
                flag_price = false;
                flag_category = false;
                flag_remark = false;

                Swal.fire({
                    title: "登記成功",
                    text: groups[submittedGroup].title +
                        "已建立，接收單位標記為「" +
                        groups[submittedGroup].receiver +
                        "」。另一專區的清單仍保留。",
                    icon: "success",
                    confirmButtonText: "確定",
                    confirmButtonColor: "#456580"
                });
            },

            error: function () {
                Swal.fire({
                    title: "登記失敗",
                    text: "請檢查後端API與伺服器回應，訂購清單已保留。",
                    icon: "error",
                    confirmButtonText: "返回",
                    confirmButtonColor: "#456580"
                });
            },

            complete: function () {
                setSending(false);
            }
        });
    });

    changeArea();
});