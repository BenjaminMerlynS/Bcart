/**
 * Created by Merlyn on 24/03/16.
 */
$('.Bcart_add').on('click', function () {
    var name = $('.Bcart_name').html();
    var image = $('.Bcart_image').attr('src');
    var weight = $('.Bcart_weight').val();
    var frozen = $('.Bcart_frozen').prop("checked");
    var less = $('.Bcart_less').prop("checked");
    var more = $('.Bcart_more').prop("checked");
    var steak = $('.Bcart_steak').prop("checked");
    var price= {
        "CZK": $('.Bcart_price').attr('data-price-czk'),
        "EUR": $('.Bcart_price').attr('data-price-eur')
    };
    var number = $('.Bcart_number').val();
    var range = $('.Bcart_range').html();
    var id =  $('.Bcart_name').attr("data-productid");
    var VAT =  $('.Bcart_vat').html();
    var animaltype = $('.Bcart_name').attr("data-animaltype");
    var frozenpossible = $('#frozencheckboxlabel').attr("data-frozenpossible");

    
    var objectindexes =[];
    var maxIndex = 0;
    if (localStorage.getItem("Bcart_items")) {
        var Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    } else {
       Bcart_items= {};
    }

    if(!jQuery.isEmptyObject(Bcart_items)) {
        $.each(Bcart_items, function (index, element) {
            objectindexes.push(index);
        });
        maxIndex = Math.max.apply(Math, objectindexes);
    }

    var Bcart_item_id = maxIndex +1;



    Bcart_items[Bcart_item_id] = {
        "name": name,
        "image": image,
        "weight": weight,
        "frozen": frozen,
        "less": less,
        "more": more,
        "steak": steak,
        "number": number,
        "price": price,
        "weightprice": calweightprice(weight, number, price),
        "range": range,
        "id": id,
        "vat": VAT,
        "animaltype": animaltype,
        "frozenpossible": frozenpossible
    };

    localStorage.setItem("Bcart_items", JSON.stringify(Bcart_items));

    updateCart();
});

function emptyCart() {
    localStorage.setItem("Bcart_items", "");
    updateCart();
}

function calweightprice (weight, number, price) {

    if (weight) {
        weightprice = weight * (price[php_curr] / 1000);
    } else {
        weightprice = number * price[php_curr];
    }

    return  roundcurrency(weightprice);
}

function updateCart () {
    if (localStorage.getItem("Bcart_items")) {
        var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    } else {
        local_Bcart_items= {};
    }

    if(jQuery.isEmptyObject(local_Bcart_items)){
        $('.Bcart_items').html('');
        $('.Bcart_quantity').html(0);
        $('.Bcart_total').html('');
        return;
    }
    var table = $(document.createElement('table'));
    table.addClass('Bcart-table');

    var tablehead = $(document.createElement('thead'));
    var tableheadtr = $(document.createElement('tr'));

    $('<th/>', {
        'class': 'Bcart-image'
    }).appendTo(tableheadtr);
    $('<th/>', {
        'class': 'Bcart-name',
        'text': CartElements[php_lang]['product']
    }).appendTo(tableheadtr);
    $('<th/>', {
        'class': 'Bcart-weightnumber',
        'text': CartElements[php_lang]['quantity'],
        'colspan':'2'
    }).appendTo(tableheadtr);
    $('<th/>', {
        'class': 'Bcart-price',
        'text': CartElements[php_lang]['price']
    }).appendTo(tableheadtr);
    $('<th/>', {
        'class': 'Bcart-frozen',
        'text': CartElements[php_lang]['frozen']
    }).appendTo(tableheadtr);
    $('<th/>', {
        'class': 'Bcart-remove',
        'html': '<a class="hand Bcart-removeall">x</a>'
    }).appendTo(tableheadtr);

    tableheadtr.appendTo(tablehead);
    tablehead.appendTo(table);

    var tablebody = $(document.createElement('tbody'));

    var lengthcount=0;
    var totalprice=0;

    $.each(local_Bcart_items, function (index, element) {
           var frozen;
            if(element.frozen) frozen="checked";
            if(!element.frozen) frozen="";


           local_Bcart_items[index]['weightprice'] = calweightprice(element.weight, element.number, element.price);

        var tablebodytr = $(document.createElement('tr'));

        $('<td/>', {
            'class': 'Bcart-image',
            'html': '<img src="' + element.image + '">'
        }).appendTo(tablebodytr);
        $('<td/>', {
            'class': 'Bcart-name',
            'text': element.name
        }).appendTo(tablebodytr);

        if (element.weight) {
            $('<td/>', {
                'class': 'Bcart-weightnumber',
                'html': '<input data-wn="weight" data-id="'+index+'" value="'+element.weight+'">'
            }).appendTo(tablebodytr);
            $('<td/>', {
                'class': 'Bcart-unit',
                'text': 'g'
            }).appendTo(tablebodytr);
        } else {
            $('<td/>', {
                'class': 'Bcart-weightnumber',
                'html': '<input data-wn="number" data-id="'+index+'" value="'+element.number+'">'
            }).appendTo(tablebodytr);
            $('<td/>', {
                'class': 'Bcart-unit',
                'text': ''
            }).appendTo(tablebodytr);
        }

        $('<td/>', {
            'class': 'Bcart-price',
            'text': local_Bcart_items[index]['weightprice'] + " " + php_curr
        }).appendTo(tablebodytr);
        if (element.frozenpossible =="true") {
            $('<td/>', {
                'class': 'Bcart-frozen',
                'html': '<input type="checkbox" data-key="' + index + '" ' + frozen + '>'
            }).appendTo(tablebodytr);
        } else {
            $('<td/>', {
                'class': 'Bcart-frozen',
                'html': '-'
            }).appendTo(tablebodytr);
        }
        $('<td/>', {
            'class': 'Bcart-remove',
            'data-key': index,
            'html': '<a class="hand Bcart-remove" data-key="'+index+'">x</a>'
        }).appendTo(tablebodytr);

        tablebodytr.appendTo(tablebody);

        lengthcount++;
        totalprice = totalprice + parseFloat(element.weightprice);
    });

    localStorage.setItem("Bcart_items", JSON.stringify(local_Bcart_items));

    tablebody.appendTo(table);

    $('.Bcart_items').html(table);
    $('.Bcart_quantity').html(lengthcount);

    $('.Bcart_total').html(roundcurrency(totalprice) + " " +php_curr);


}

function roundcurrency (price) {

    var priceround;

    if(php_curr == "EUR") {
        priceround = price.toFixed(2);
    } else {
        priceround = price.toFixed(0);
    }
    return priceround;
}


function calculateVAT() {

    if (localStorage.getItem("Bcart_items")) {
        var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    }

    if(jQuery.isEmptyObject(local_Bcart_items)) {
        return;
    }

    var totalpricenoVAT = 0;
    var VAT = 0;
    $.each(local_Bcart_items, function (index, element) {
        VAT = VAT + parseFloat(element.weightprice)*parseFloat(element.vat);
        totalpricenoVAT = totalpricenoVAT + parseFloat(element.weightprice)*(1-parseFloat(element.vat));
    });

    $('.Bcart_total_noVAT').html(roundcurrency (totalpricenoVAT) + " " + php_curr);
    $('.Bcart_VAT').html(roundcurrency (VAT) + " " + php_curr);
}

$(document).ready(function() {
    updateCart();
    calculateVAT();
});

$(document.body).on('click', '.Bcart-remove', function() {
    var itemkey = $(this).attr('data-key');

    var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));

    delete local_Bcart_items[itemkey];

    localStorage.setItem("Bcart_items", JSON.stringify(local_Bcart_items));


    updateCart();
    calculateVAT();

});

$(document.body).on('click', '.Bcart-removeall', function() {
    localStorage.setItem("Bcart_items", "{}");
    updateCart();
   // calculateVAT();
});


$('.Bcart_checkout').on('click', function () {
    var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    if(!jQuery.isEmptyObject(local_Bcart_items)) {
        window.location.href = "checkout.php";
    }
    calculateVAT();
});

$(document.body).on('change', '.Bcart-weightnumber input', function () {
    
    var $this = $(this);
    var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    var controler = false;

    var index = $this.attr('data-id');
    var wn = $this.attr('data-wn');
    var quantity = $this.val();
    var price =  local_Bcart_items[index]['price'];
    var newprice;

    var weightRange = local_Bcart_items[index]['range'].split("-");
    var minWeight = parseInt(weightRange[0]);



    if (wn == "weight") {
        if (quantity % 1 !== 0) {
            $this.attr("style", "color:red");
            $('.inputalertcart').html("Please input only numbers").fadeIn().delay(5000).fadeOut('slow');
            $this.val(local_Bcart_items[index]['weight']);
        } else {
            if (quantity < minWeight) {
                $('.inputalertcart').html("Please choose a weight over the "+minWeight+" g minimum").fadeIn().delay(5000).fadeOut('slow');
                $this.attr("style", "color:red");
                $this.val(local_Bcart_items[index]['weight']);
                setTimeout(function () {
                    $this.attr("style", "");
                }, 2000);
            } else {
                newprice = parseInt(price[php_curr]) * parseInt(quantity) / 1000;
                local_Bcart_items[index]['weight'] = quantity;
                local_Bcart_items[index]['weightprice'] = roundcurrency (newprice);

                controler = true;
            }
        }

    } else {

        if (quantity % 1 !== 0) {
            $this.attr("style", "color:red");
            $('.inputalertcart').html("Please input only numbers").fadeIn().delay(5000).fadeOut('slow');
            $this.val(local_Bcart_items[index]['number']);
            setTimeout(function () {
                $this.attr("style", "");
            }, 2000);
        } else {
            newprice = parseInt(price[php_curr]) * parseInt(quantity);
            local_Bcart_items[index]['number'] = quantity;
            local_Bcart_items[index]['weightprice'] = roundcurrency (newprice);

            controler = true;
        }


    }

    if (controler) {
        localStorage.setItem("Bcart_items", JSON.stringify(local_Bcart_items));
        updateCart();
        calculateVAT();
    }

});

$(document.body).on('change', '.Bcart-frozen input', function () {

    var index = $(this).attr("data-key");
    var local_Bcart_items = JSON.parse(localStorage.getItem("Bcart_items"));
    
    if ($(this).prop("checked")) {
        local_Bcart_items[index]['frozen']= true;
    } else {
        local_Bcart_items[index]['frozen']= false;
    }
    localStorage.setItem("Bcart_items", JSON.stringify(local_Bcart_items));
});