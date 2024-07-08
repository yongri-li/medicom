document.addEventListener("DOMContentLoaded", function(event) {
    var discount_item = document.querySelectorAll(".quantity-discount-bar .discount-step");
    const currencySymbol = document.getElementById('currency-symbol').value;
    var input;
    var cnt = 0;
    const priceShowCtrl = document.querySelector('.f8pr-price');
    let oldPrice,oldMetafieldPrice;
    let oldPricePerOne,oldMetafieldPricePerOne;
    discount_item.forEach(item => {
        cnt ++;
        item.setAttribute("data-index", cnt);
    });

    const changePrice = (quantity) => {
        oldPrice = oldPricePerOne * quantity;
        oldMetafieldPrice = oldMetafieldPricePerOne;
    }
    const processShowCtrl = (selectedQuantity) => {
        let price = oldPrice;
        let metafieldPrice = oldMetafieldPrice;
        
        if(selectedQuantity === 2) {
            price *= 0.85;
            metafieldPrice = oldMetafieldPrice * 0.85;
        } else if (selectedQuantity === 3) {
            price *= 0.8;
            metafieldPrice = oldMetafieldPrice  * 0.8;
        } else if(selectedQuantity > 3) {
            price *= 0.75;
            metafieldPrice = oldMetafieldPrice * 0.75;
        }

        const tsMetafieldPrice = priceShowCtrl.querySelector('span.small').innerText;
        const i = tsMetafieldPrice.lastIndexOf(currencySymbol);
        const j = tsMetafieldPrice.indexOf(')',i);
        const frontStr = tsMetafieldPrice.substring(0, findPricePos(tsMetafieldPrice));
        let backStr;
        if(j !== -1) {
            backStr = tsMetafieldPrice.substring(j + 1);
        } else {
            backStr = tsMetafieldPrice.substring(i + 1);
        }
        if(selectedQuantity === 1) {
            priceShowCtrl.innerHTML = `${price.toFixed(2)}${currencySymbol}<span class='small'>${frontStr}${metafieldPrice.toFixed(2)}${currencySymbol}${backStr}</span>`;
        } else {
            priceShowCtrl.innerHTML = `${price.toFixed(2)}${currencySymbol}<span class='original-price'>${oldPrice.toFixed(2)}${currencySymbol}</span><span class='small'>${frontStr}${metafieldPrice.toFixed(2)}€<span class="original-price meta-field">(${oldMetafieldPrice.toFixed(2)}€)</span>${backStr}</span>`;
        }
    }
    const getOldPrice = () => {
        const tsPrice = priceShowCtrl.innerText;
        const metafieldValue = priceShowCtrl.querySelector('span').innerText;
        const i = tsPrice.indexOf(currencySymbol);
        const j = metafieldValue.indexOf(currencySymbol);
        const k = findPricePos(metafieldValue);
        oldPricePerOne = oldPrice = parseFloat(tsPrice.substring(0, i).replace(',','.'));
        oldMetafieldPricePerOne = oldMetafieldPrice = parseFloat(metafieldValue.substring(k, j).replace(',','.'));
    }
    const findPricePos = (str) => {
        const len = str.length;
        for(let i = 0;i < len; i++) {
            const ch = parseInt(str.charAt(i));
            if(!isNaN(ch)) {
                return i;
            }
        }
        return -1;
    }
    getOldPrice();
    let hTime = setTimeout(function() {
        clearTimeout(hTime);
        input = document.querySelector(".semantic-amount input");

        discount_item[parseInt(input.value) - 1].classList.add("active");

        input.addEventListener("change", function(event) {
            if(this.value <= 0) {
                return;
            }
            discount_item.forEach(item => {
                item.classList.remove("active");
            });

            // if(parseInt(this.value) > discount_item.length) {
            //     discount_item[discount_item.length - 1].classList.add("active");
            //     return;
            // }
            changePrice(parseInt(this.value));
            const quantity = parseInt(this.value);
            if(quantity >= 4) {
                discount_item[2].classList.add('active');
            } else if(quantity === 3) {
                discount_item[1].classList.add('active');
            } else if(quantity === 2) {
                discount_item[0].classList.add('active');
            }
            processShowCtrl(quantity);
            // discount_item[parseInt(this.value) - 1].classList.add("active");
        })

        discount_item.forEach(item => {
            item.addEventListener("click", function() {
                discount_item.forEach(item => {
                    item.classList.remove("active");
                });
                item.classList.add("active");
                const quantity = parseInt(item.getAttribute("data-quantity"));
                input.value = quantity;
                changePrice(quantity);
                processShowCtrl(quantity);
            })
        });
        discount_item.forEach(item=>{
            item.classList.remove('active');
        });
        
    }, 1000);

});